export {
  apiFetch,
  apiFetchPaginated,
  SESSION_EXPIRED_EVENT,
} from "./client";
export type { ApiMeta, PaginatedResult } from "./client";
export { HttpError } from "./http-error";
export {
  checkout,
  fetchAccessories,
  fetchBlades,
  fetchCategories,
  fetchCollectionByHandle,
  fetchCollections,
  fetchFeaturedProducts,
  fetchHandles,
  fetchNewArrivals,
  fetchOrderById,
  fetchProductBySlug,
  fetchProductReviews,
  fetchProducts,
  fetchShapes,
  fetchUserOrders,
  getProfile,
  login,
  logout,
  register,
  submitReview,
  subscribeNewsletter,
  validateCoupon,
} from "./endpoints";
export type {
  CheckoutItem,
  CheckoutPayload,
  ProductListParams,
} from "./endpoints";
export type {
  ApiAuthResponse,
  ApiAuthTokens,
  ApiCategory,
  ApiCollection,
  ApiCoupon,
  ApiKnifeAccessory,
  ApiKnifeBlade,
  ApiKnifeHandle,
  ApiKnifeShape,
  ApiOrder,
  ApiOrderItem,
  ApiProduct,
  ApiProductHighlight,
  ApiProductImage,
  ApiProductSpec,
  ApiReview,
  ApiUser,
} from "./types";
export { uploadImage } from "./upload.api";
