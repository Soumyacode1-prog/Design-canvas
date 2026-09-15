import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';
import app from '../dist/app.js';
import { User, Session, AuthAttempt } from '../dist/auth/models.js';
import { Canvas } from '../dist/models/canvas.model.js';
import { hashToken } from '../dist/auth/security.js';

test('cookie authentication, ownership, rotation, replay, expiration and logout', { timeout: 60000 }, async () => {
  assert.ok(process.env.MONGODB_URI, 'MONGODB_URI is required for the isolated integration database');
  const dbName = `minicanvas_auth_test_${randomBytes(8).toString('hex')}`;
  await mongoose.connect(process.env.MONGODB_URI, { dbName, serverSelectionTimeoutMS: 10000 });
  let server;
  try {
    await Promise.all([User.init(), Session.init(), AuthAttempt.init(), Canvas.init()]);
    server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}/api`;
    const origin = process.env.CLIENT_URL || 'http://localhost:3000';
    const password = 'Correct horse battery staple 42';
    async function request(path, method = 'GET', body, cookie = '', requestOrigin = origin) {
      return fetch(base + path, { method, headers: { Origin: requestOrigin, 'Content-Type': 'application/json', Cookie: cookie }, ...(body ? { body: JSON.stringify(body) } : {}) });
    }
    const cookies = res => res.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
    const account = email => ({ name: 'Test user', email, password });
    assert.equal((await request('/canvases')).status, 401);
    assert.equal((await request('/auth/signup', 'POST', account('a@example.com'), '', 'https://evil.example')).status, 403);
    assert.equal((await request('/auth/signup', 'POST', { ...account('a@example.com'), password: 'short' })).status, 400);
    assert.equal((await request('/auth/signup', 'POST', account('a@example.com'))).status, 201);
    assert.equal((await request('/auth/signup', 'POST', account('A@example.com'))).status, 409);
    const stored = await User.findOne({ email: 'a@example.com' }).select('+passwordHash');
    assert.notEqual(stored.passwordHash, password);
    assert.equal((await request('/auth/login', 'POST', { email: 'a@example.com', password: 'wrong password 123' })).status, 401);
    const login = await request('/auth/login', 'POST', account('a@example.com'));
    assert.equal(login.status, 200);
    assert.equal((await login.json()).user.passwordHash, undefined);
    for (const cookie of login.headers.getSetCookie()) {
      assert.match(cookie, /HttpOnly/);
      assert.match(cookie, /SameSite=Lax/);
      if (process.env.NODE_ENV === 'production') assert.match(cookie, /Secure/);
    }
    const original = cookies(login);
    assert.equal((await request('/auth/me', 'GET', undefined, original)).status, 200);
    const design = { title: 'Private', width: 900, height: 560, elements: [] };
    const created = await request('/canvases', 'POST', design, original);
    assert.equal(created.status, 201);
    const canvas = await created.json();
    assert.equal(String(canvas.owner), String(stored._id));
    await request('/auth/signup', 'POST', account('b@example.com'));
    const other = cookies(await request('/auth/login', 'POST', account('b@example.com')));
    assert.deepEqual(await (await request('/canvases', 'GET', undefined, other)).json(), []);
    for (const method of ['GET', 'PUT', 'DELETE']) {
      assert.equal((await request(`/canvases/${canvas._id}`, method, method === 'PUT' ? design : undefined, other)).status, 404);
    }
    assert.equal((await request(`/canvases/${canvas._id}`, 'PUT', { title: 'Updated', owner: 'bad' }, original)).status, 200);
    await Session.updateOne({ user: stored._id }, { $set: { accessExpiresAt: new Date(0) } });
    assert.equal((await request('/auth/me', 'GET', undefined, original)).status, 401);
    const refreshed = await request('/auth/refresh', 'POST', undefined, original);
    assert.equal(refreshed.status, 200);
    const rotated = cookies(refreshed);
    assert.notEqual(rotated, original);
    assert.equal((await request('/auth/me', 'GET', undefined, rotated)).status, 200);
    assert.equal((await request('/auth/refresh', 'POST', undefined, original)).status, 401);
    assert.equal((await request('/auth/me', 'GET', undefined, rotated)).status, 401);
    assert.equal((await request('/auth/refresh', 'POST', undefined, rotated)).status, 401);
    const again = cookies(await request('/auth/login', 'POST', account('a@example.com')));
    assert.equal((await request(`/canvases/${canvas._id}`, 'DELETE', undefined, again)).status, 204);
    const logout = await request('/auth/logout', 'POST', undefined, again);
    assert.equal(logout.status, 204);
    assert.ok(logout.headers.getSetCookie().every(value => value.includes('Expires=Thu, 01 Jan 1970')));
    assert.equal((await request('/auth/me', 'GET', undefined, again)).status, 401);
    assert.equal((await request('/auth/refresh', 'POST', undefined, again)).status, 401);
    const expired = cookies(await request('/auth/login', 'POST', account('a@example.com')));
    const refreshValue = expired.split('; ').find(x => x.startsWith('refresh_token=')).split('=')[1];
    await Session.updateOne({ refreshHash: hashToken(refreshValue) }, { $set: { expiresAt: new Date(0) } });
    assert.equal((await request('/auth/refresh', 'POST', undefined, expired)).status, 401);
    await AuthAttempt.updateMany({}, { $set: { count: 30 } });
    assert.equal((await request('/auth/login', 'POST', account('a@example.com'))).status, 429);
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    // Only the randomly named database created by this test is removed.
    assert.equal(mongoose.connection.name, dbName);
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});
