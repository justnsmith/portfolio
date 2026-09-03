import type { ComponentType } from "react";
import KvWritePath from "./KvWritePath";
import KvReadPath from "./KvReadPath";

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
};
