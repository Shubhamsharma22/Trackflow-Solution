import AsyncHandler from "../../Utils/AsyncHandler.Utils.js"

// With header-based auth, logout is handled on the frontend by discarding the token.
// This endpoint exists for API consistency.
const LogoutController = AsyncHandler(async (_req, res) => {
  res.status(200).json({ message: "User logged out successfully" })
})

export default LogoutController
