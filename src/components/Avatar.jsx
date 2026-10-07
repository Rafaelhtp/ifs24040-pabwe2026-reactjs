import React from "react";
import PropTypes from "prop-types";
import { getImageUrl } from "../helpers/toolsHelper";

const SIZES = {
  sm: "h-8 w-8 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-24 w-24 text-3xl",
};

// Foto profil; jika tidak ada foto, tampilkan inisial nama.
export default function Avatar({ name, photo, size = "sm" }) {
  const src = getImageUrl(photo);
  const sizeClass = SIZES[size] ?? SIZES.sm;
  const initial = String(name || "U").charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={`Foto ${name || "pengguna"}`}
        className={`${sizeClass} shrink-0 rounded-full border border-slate-200 object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 to-cyan-600 font-bold text-white`}
    >
      {initial}
    </span>
  );
}

Avatar.propTypes = {
  name: PropTypes.string,
  photo: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};
