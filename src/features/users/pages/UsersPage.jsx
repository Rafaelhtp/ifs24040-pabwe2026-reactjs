import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconUsers, IconSearch, IconMail, IconLoader2 } from "@tabler/icons-react";
import { asyncSetUsers } from "../states/action";
import Avatar from "../../../components/Avatar";

export default function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let active = true;
    Promise.resolve(dispatch(asyncSetUsers())).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (user) =>
        String(user.name ?? "").toLowerCase().includes(query) ||
        String(user.email ?? "").toLowerCase().includes(query)
    );
  }, [users, keyword]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Daftar Pengguna
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Seluruh akun yang terdaftar di Delcom Lost &amp; Founds.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full max-w-md">
            <label htmlFor="search-user" className="sr-only">
              Cari pengguna
            </label>
            <IconSearch
              size={18}
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              id="search-user"
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Total: {filteredUsers.length} pengguna
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
          {loading && users.length === 0 ? (
            <div role="status" className="col-span-full py-16 text-center text-slate-600">
              <IconLoader2 size={36} className="mx-auto mb-2 animate-spin text-blue-700" />
              Memuat daftar pengguna...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-600">
              <IconUsers size={40} className="mx-auto mb-2 text-slate-300" aria-hidden="true" />
              Tidak ada pengguna ditemukan.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <article
                key={user.id}
                className="flex items-center gap-3.5 rounded-2xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:shadow-md"
              >
                <Avatar name={user.name} photo={user.photo} size="md" />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-bold text-slate-900">{user.name}</h2>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-600">
                    <IconMail size={14} aria-hidden="true" className="shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
