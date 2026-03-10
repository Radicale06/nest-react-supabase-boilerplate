export const UserRoutes = {
  dashboard: {
    pageName: "Dashboard",
    path: "/user/dashboard",
  },
  profile: {
    pageName: "Profile",
    path: "/user/dashboard/profile",
  },
  page: {
    pageName: "Page",
    path: "/user/dashboard/page",
  },
};

export const AdminRoutes = {
  dashboard: {
    pageName: "Dashboard",
    path: "/admin/dashboard",
  },
  profile: {
    pageName: "Profile",
    path: "/admin/dashboard/profile",
  },
  page: {
    pageName: "Page",
    path: "/admin/dashboard/page",
  },
};

export const OtherRoutes = {
  landing: {
    pageName: "Home",
    path: "/",
  },
  login: {
    pageName: "Login",
    path: "/login",
  },
  unauthorized: {
    pageName: "Unauthorized",
    path: "/unauthorized",
  },
  all: {
    pageName: "Other",
    path: "*",
  },
};
