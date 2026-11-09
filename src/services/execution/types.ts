/**
 * Contract for the isolated PHP execution engine (Phase 3).
 * NOT IMPLEMENTED. PHP must never run inside the Next.js process.
 * See TECHNICAL_ARCHITECTURE.md §6 for the sandbox requirements.
 */

export interface SourceFile {
  /** Relative path inside the exercise workspace, e.g. "funciones.php". */
  path: string;
  content: string;
}

export interface ExecutionRequest {
  files: SourceFile[];
  /** File executed by the PHP CLI. */
  entry: string;
  stdin?: string;
}

export interface ExecutionLimits {
  wallTimeMs: number;
  memoryMb: number;
  maxOutputBytes: number;
}

export type ExecutionResult =
  | { status: "ok"; stdout: string; stderr: string; durationMs: number }
  | { status: "php-error"; stdout: string; stderr: string; line?: number; message: string }
  | { status: "timeout" | "output-limit" | "memory-limit"; stdout: string }
  | { status: "unavailable"; reason: string };

export interface CodeExecutionService {
  readonly limits: ExecutionLimits;
  run(request: ExecutionRequest): Promise<ExecutionResult>;
}

export const DEFAULT_LIMITS: ExecutionLimits = {
  wallTimeMs: 3000,
  memoryMb: 128,
  maxOutputBytes: 64 * 1024,
};
