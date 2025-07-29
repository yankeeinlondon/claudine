import { createKindError } from "@yankeeinlondon/kind-error";

export const Unexpected = createKindError("Unexpected", {
    library: "claudine"
});
