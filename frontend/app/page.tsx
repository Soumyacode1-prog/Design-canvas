"use client";

  import { useEffect, useRef, useState } from "react";
  import AuthForm, { type AuthUser } from "./auth-form";
  import { apiRequest, authRequest } from "./lib/api";
  import { flushSync } from "react-dom";
  import type Konva from "konva"; 
  import { Circle, Layer, Rect, Stage, Text } from "react-konva";

  type ElementType = "rectangle" | "circle" | "text";

  type CanvasElement = {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    rotation: number;
    fill: string;
    text?: string;
    fontSize?: number;
    zIndex: number;
  };

  type SavedCanvas = {
    _id: string;
    title: string;
    width: number;
    height: number;
    elements: CanvasElement[];
  };

  const canvasWidth = 900;
  const canvasHeight = 560;

  export default function Home() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const stageRef = useRef<Konva.Stage>(null);
    const [title, setTitle] = useState("My first design");
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [canvasId, setCanvasId] = useState<string | null>(null);
    const [savedCanvases, setSavedCanvases] = useState<SavedCanvas[]>([]);
    const [message, setMessage] = useState("");

    const selectedElement =
      elements.find((element) => element.id === selectedId) || null;

    async function loadCanvases() {
      try {
        const response = await apiRequest("/canvases");
        const data = await response.json();
        if (!response.ok) { setMessage(data.message || "Could not load designs."); return; }
        setSavedCanvases(data);
      } catch {
        setMessage("Backend is not running.");
      }
    }

    useEffect(() => {
      let active = true;
      const expire = () => {
        setUser(null);
        setSavedCanvases([]);
        setCanvasId(null);
        setElements([]);
        setSelectedId(null);
        setTitle("My first design");
      };
      window.addEventListener("auth-expired", expire);
      apiRequest("/auth/me")
        .then(async response => {
          if (response.ok) {
            const data = await response.json();
            if (active) setUser(data.user);
          }
        })
        .catch(() => { if (active) setMessage("Cannot reach the server."); })
        .finally(() => { if (active) setCheckingAuth(false); });
      return () => { active = false; window.removeEventListener("auth-expired", expire); };
    }, []);

    useEffect(() => {
      if (!user) return;
      let active = true;
      apiRequest("/canvases").then(async response => {
        const data = await response.json();
        if (!active) return;
        if (response.ok) setSavedCanvases(data);
        else setMessage(data.message || "Could not load designs.");
      }).catch(() => { if (active) setMessage("Could not load designs."); });
      return () => { active = false; };
    }, [user]);

    async function logout() {
      try {
        const response = await authRequest("/auth/logout", { method: "POST" });
        if (!response.ok) throw new Error("Logout failed");
        setUser(null);
        setSavedCanvases([]);
        newCanvas();
        setMessage("");
      } catch { setMessage("Could not log out. Please try again."); }
    }

    function addShape(type: ElementType) {
      const id = crypto.randomUUID();

      let newElement: CanvasElement;

      if (type === "rectangle") {
        newElement = {
          id,
          type: "rectangle",
          x: 120,
          y: 120,
          width: 160,
          height: 100,
          rotation: 0,
          fill: "#6366f1",
          zIndex: elements.length,
        };
      } else if (type === "circle") {
        newElement = {
          id,
          type: "circle",
          x: 180,
          y: 160,
          radius: 60,
          rotation: 0,
          fill: "#ec4899",
          zIndex: elements.length,
        };
      } else {
        newElement = {
          id,
          type: "text",
          x: 120,
          y: 120,
          text: "Hello Canvas",
          fontSize: 28,
          rotation: 0,
          fill: "#111827",
          zIndex: elements.length,
        };
      }

      setElements([...elements, newElement]);
      setSelectedId(id);
    }

    function updateElement(id: string, changes: Partial<CanvasElement>) {
      setElements(
        elements.map((element) =>
          element.id === id ? { ...element, ...changes } : element
        )
      );
    }

    function exportPNG() {
      const stage = stageRef.current;
      if (!stage) return;

      try {
        flushSync(() => setSelectedId(null));
        stage.draw();

        const dataURL = stage.toDataURL({
          mimeType: "image/png",
          pixelRatio: 2,
        });
        const filename = title.trim().replace(/[\\/:*?"<>|]/g, "-") || "design";
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        try {
          link.click();
        } finally {
          link.remove();
        }
        setMessage("PNG export started.");
      } catch {
        setMessage("Could not export PNG. Please try again.");
      }
    }

    async function saveCanvas() {
      if (!title.trim()) {
        setMessage("Please enter a title.");
        return;
      }

      const payload = {
        title,
        width: canvasWidth,
        height: canvasHeight,
        elements,
      };

      try {
        const response = await apiRequest(
          canvasId
            ? `/canvases/${canvasId}`
            : "/canvases",
          {
            method: canvasId ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const savedCanvas = await response.json();

        if (!response.ok) {
          setMessage("Could not save canvas.");
          return;
        }

        setCanvasId(savedCanvas._id);
        setMessage("Saved successfully in MongoDB.");
        loadCanvases();
      } catch {
        setMessage("Save failed. Check backend and MongoDB connection.");
      }
    }

    function openCanvas(canvas: SavedCanvas) {
      setCanvasId(canvas._id);
      setTitle(canvas.title);
      setElements(canvas.elements);
      setSelectedId(null);
      setMessage(`Opened: ${canvas.title}`);
    }

    async function deleteCanvas(id: string) {
      try {
        const response = await apiRequest(`/canvases/${id}`, { method: "DELETE" });
        if (!response.ok) { setMessage("Could not delete design."); return; }
        if (id === canvasId) newCanvas();
        await loadCanvases();
      } catch { setMessage("Could not delete design. Please try again."); }
    }

    function newCanvas() {
      setCanvasId(null);
      setTitle("My first design");
      setElements([]);
      setSelectedId(null);
      setMessage("New canvas created.");
    }

    if (checkingAuth) return <main className="p-8">Loading your account…</main>;
    if (!user) return <AuthForm onLogin={setUser} />;

    return (
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <header className="flex h-16 items-center justify-between bg-slate-900 px-6 text-white">
          <div>
            <h1 className="font-bold">MiniCanvas</h1>
            <p className="text-xs text-slate-400">Design editor</p>
          </div>

          <input
            className="rounded bg-slate-800 px-3 py-2 text-sm outline-none"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Design title"
          />

          <div className="flex items-center gap-3">
            <span role="status" className="text-xs text-slate-300">{message}</span>
            <span className="text-sm">{user.name}</span>
            <button onClick={logout} className="rounded border border-slate-500 px-3 py-2 text-sm">Log out</button>

            <button
              onClick={newCanvas}
              className="rounded border border-slate-500 px-3 py-2 text-sm"
            >
              New
            </button>

            <button
              onClick={saveCanvas}
              className="rounded bg-indigo-500 px-4 py-2 text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={exportPNG}
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium"
            >
              Export PNG
            </button>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-64px)] grid-cols-[210px_1fr_240px]">
          <aside className="border-r bg-white p-5">
            <h2 className="mb-3 text-sm font-bold">ADD SHAPES</h2>

            <button
              onClick={() => addShape("rectangle")}
              className="mb-2 w-full rounded border p-2 text-left"
            >
              ▭ Rectangle
            </button>

            <button
              onClick={() => addShape("circle")}
              className="mb-2 w-full rounded border p-2 text-left"
            >
              ○ Circle
            </button>

            <button
              onClick={() => addShape("text")}
              className="w-full rounded border p-2 text-left"
            >
              T Text
            </button>

            <h2 className="mb-3 mt-8 text-sm font-bold">MY DESIGNS</h2>

            {savedCanvases.length === 0 && (
              <p className="text-sm text-slate-500">No saved designs yet.</p>
            )}

            {savedCanvases.map((canvas) => (
              <div key={canvas._id} className="mb-2 flex gap-1">
                <button
                  onClick={() => openCanvas(canvas)}
                  className="w-full truncate rounded border p-2 text-left text-sm"
                >
                  {canvas.title}
                </button>

                <button
                  onClick={() => deleteCanvas(canvas._id)}
                  className="rounded border border-red-200 px-2 text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </aside>

          <section className="flex items-center justify-center overflow-auto bg-slate-200 p-8">
            <div className="bg-white shadow-xl">
              <Stage
                ref={stageRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={(event) => {
                  if (event.target === event.target.getStage()) {
                    setSelectedId(null);
                  }
                }}
              >
                <Layer>
                  <Rect
                    width={canvasWidth}
                    height={canvasHeight}
                    fill="#ffffff"
                    listening={false}
                  />
                  {[...elements]
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map((element) => {
                      const isSelected = element.id === selectedId;

                      const commonProps = {
                        x: element.x,
                        y: element.y,
                        draggable: true,
                        onClick: () => setSelectedId(element.id),
                        onTap: () => setSelectedId(element.id),
                        onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
                          updateElement(element.id, {
                            x: event.target.x(),
                            y: event.target.y(),
                          });
                        },
                      };

                      if (element.type === "rectangle") {
                        return (
                          <Rect
                            key={element.id}
                            {...commonProps}
                            width={element.width}
                            height={element.height}
                            fill={element.fill}
                            stroke={isSelected ? "#2563eb" : undefined}
                            strokeWidth={isSelected ? 3 : 0}
                          />
                        );
                      }

                      if (element.type === "circle") {
                        return (
                          <Circle
                            key={element.id}
                            {...commonProps}
                            radius={element.radius}
                            fill={element.fill}
                            stroke={isSelected ? "#2563eb" : undefined}
                            strokeWidth={isSelected ? 3 : 0}
                          />
                        );
                      }

                      return (
                        <Text
                          key={element.id}
                          {...commonProps}
                          text={element.text}
                          fontSize={element.fontSize}
                          fill={element.fill}
                        />
                      );
                    })}
                </Layer>
              </Stage>
            </div>
          </section>

          <aside className="border-l bg-white p-5">
            <h2 className="mb-4 text-sm font-bold">PROPERTIES</h2>

            {!selectedElement && (
              <p className="text-sm text-slate-500">
                Click a shape to edit it.
              </p>
            )}

            {selectedElement && (
              <div className="space-y-3">
                <label className="block text-sm">
                  Colour
                  <input
                    className="mt-1 block h-10 w-full"
                    type="color"
                    value={selectedElement.fill}
                    onChange={(event) =>
                      updateElement(selectedElement.id, {
                        fill: event.target.value,
                      })
                    }
                  />
                </label>

                <label className="block text-sm">
                  X Position
                  <input
                    className="mt-1 w-full rounded border p-2"
                    type="number"
                    value={selectedElement.x}
                    onChange={(event) =>
                      updateElement(selectedElement.id, {
                        x: Number(event.target.value),
                      })
                    }
                  />
                </label>

                <label className="block text-sm">
                  Y Position
                  <input
                    className="mt-1 w-full rounded border p-2"
                    type="number"
                    value={selectedElement.y}
                    onChange={(event) =>
                      updateElement(selectedElement.id, {
                        y: Number(event.target.value),
                      })
                    }
                  />
                </label>

                {selectedElement.type === "rectangle" && (
                  <>
                    <label className="block text-sm">
                      Width
                      <input
                        className="mt-1 w-full rounded border p-2"
                        type="number"
                        value={selectedElement.width}
                        onChange={(event) =>
                          updateElement(selectedElement.id, {
                            width: Number(event.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="block text-sm">
                      Height
                      <input
                        className="mt-1 w-full rounded border p-2"
                        type="number"
                        value={selectedElement.height}
                        onChange={(event) =>
                          updateElement(selectedElement.id, {
                            height: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                  </>
                )}

                {selectedElement.type === "circle" && (
                  <label className="block text-sm">
                    Radius
                    <input
                      className="mt-1 w-full rounded border p-2"
                      type="number"
                      value={selectedElement.radius}
                      onChange={(event) =>
                        updateElement(selectedElement.id, {
                          radius: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                )}

                {selectedElement.type === "text" && (
                  <label className="block text-sm">
                    Text
                    <input
                      className="mt-1 w-full rounded border p-2"
                      value={selectedElement.text}
                      onChange={(event) =>
                        updateElement(selectedElement.id, {
                          text: event.target.value,
                        })
                      }
                    />
                  </label>
                )}

                <button
                  onClick={() => {
                    setElements(
                      elements.filter(
                        (element) => element.id !== selectedElement.id
                      )
                    );
                    setSelectedId(null);
                  }}
                  className="w-full rounded bg-red-50 p-2 text-sm text-red-600"
                >
                  Delete shape
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    );
  }
