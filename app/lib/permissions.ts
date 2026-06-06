import type { Session } from "next-auth";

export const AUTHOR_ROLE = "ADMIN";
export const READER_ROLE = "USER";

export const isAuthor = (session: Session | null) =>
    session?.user?.role === AUTHOR_ROLE;

export const canReact = (session: Session | null) => Boolean(session?.user?.id);

