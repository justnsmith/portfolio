import type { ComponentType } from "react";
import KvWritePath from "./KvWritePath";
import KvReadPath from "./KvReadPath";
import SqlplusCascade from "./SqlplusCascade";
import SqlplusOffline from "./SqlplusOffline";
import SqlplusEmbeddingFix from "./SqlplusEmbeddingFix";

/**
 * Diagrams a writeup can drop in, by name. In Markdown:
 *
 *     ```diagram
 *     kv-write-path
 *     ```
 *
 * An unknown name renders nothing rather than breaking the page.
 */
export const diagrams: Record<string, ComponentType> = {
    "kv-write-path": KvWritePath,
    "kv-read-path": KvReadPath,
    "sqlplus-cascade": SqlplusCascade,
    "sqlplus-offline": SqlplusOffline,
    "sqlplus-embedding-fix": SqlplusEmbeddingFix,
};
