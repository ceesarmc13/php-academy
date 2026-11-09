export type Theme = "dark" | "light";
export const THEME_STORAGE_KEY = "pa-theme";

/** Runs before paint (inlined in <head>) to apply the stored theme without a flash. Dark is the default. */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
