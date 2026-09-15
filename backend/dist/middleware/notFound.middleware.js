export const notFound = (_req, res) => {
    return res.status(404).json({
        message: "Route not found",
    });
};
//# sourceMappingURL=notFound.middleware.js.map