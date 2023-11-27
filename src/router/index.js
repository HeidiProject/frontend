import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import SpreadsheetValidatorView from "../views/SpreadsheetValidatorView.vue";
import AboutView from "../views/DocsView.vue";
import TokenManagementView from "../views/TokenManagementView.vue";

const routes = [
  {
    path: "/",
    name: "validator",
    component: SpreadsheetValidatorView,
  },
  {
    path: "/tokens",
    name: "token-management",
    component: TokenManagementView,
  },
  {
    path: "/docs",
    name: "docs",
    component: AboutView,
  },
  {
    path: "/processing",
    name: "data-processing",
    props: true,
    component: () => import("../views/DataProcessingView.vue"),
  },
  {
    path: "/data-processing/:_id",
    name: "processing-details",
    props: true,
    component: () => import("../views/DataProcessingView.vue"),
  },
  {
    path: "/vespa",
    name: "vespa-processing",
    props: true,
    component: () => import("../views/VespaProcessingView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes,
});

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/","/docs"];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.isAuthenticated) {
    auth.returnUrl = to.fullPath;
    return "/";
  }
});

// https://stackoverflow.com/questions/36261225/why-is-export-default-const-invalid
export default router;
