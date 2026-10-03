import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncUploadCoverLostFound,
  setIsLostFoundChangedCoverActionCreator,
} from "../states/action";
import { IconX, IconUpload, IconPhoto } from "@tabler/icons-react";
import { showWarningDialog } from "../../../helpers/toolsHelper";

export default function ChangeCoverModal({ isOpen, onClose, itemId, onSuccess }) {
  const dispatch = useDispatch();
  const isLostFoundChangeCover = useSelector((state) => state.isLostFoundChangeCover);
  const isLostFoundChangedCover = useSelector((state) => state.isLostFoundChangedCover);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (isLostFoundChangedCover) {
      setSelectedFile(null);
      setPreviewUrl(null);
      dispatch(setIsLostFoundChangedCoverActionCreator(false));
      if (onSuccess) onSuccess();
      onClose();
    }
  }, [isLostFoundChangedCover, dispatch, onClose, onSuccess]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showWarningDialog("File harus berupa gambar!");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showWarningDialog("Silakan pilih berkas gambar terlebih dahulu!");
      return;
    }
    dispatch(asyncUploadCoverLostFound(itemId, selectedFile));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-800">Unggah Foto Cover</h2>
          <button
            onClick={onClose}
            aria-label="Tutup Dialog Unggah Foto Cover"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <IconX size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="mt-4 space-y-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 transition-all hover:border-blue-400 bg-slate-50">
            {previewUrl ? (
              <div className="relative w-full overflow-hidden rounded-xl">
                <img
                  src={previewUrl}
                  alt="Preview Cover"
                  className="h-48 w-full object-cover rounded-xl"
                />
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <IconPhoto size={48} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-medium">Klik untuk memilih gambar</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG (Maks. 2MB)</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-4 block w-full text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Batal Unggah Foto Cover"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundChangeCover || !selectedFile}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-50"
            >
              <IconUpload size={18} />
              {isLostFoundChangeCover ? "Mengunggah..." : "Unggah Sekarang"}
            </button>
            <button
              onClick={onClose}
              aria-label="Tutup Dialog Ubah Cover"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <span className="sr-only">Tutup Dialog Ubah Cover</span>
              <IconX size={20} aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}