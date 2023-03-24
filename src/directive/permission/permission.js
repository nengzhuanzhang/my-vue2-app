import store from "@/store";

function checkPermission(el, binding) {
  const { value } = binding;
  const permissions = store.getters && store.getters.permissions;

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value;

      const hasPermission = permissions.some((perm) => {
        return permissionRoles.includes(perm);
      });

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`need perms! Like v-permission="['P-001','P-002']"`);
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding);
  },
  update(el, binding) {
    checkPermission(el, binding);
  },
};
