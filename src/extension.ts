import * as path from "path";
import { ExtensionContext, window } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

const platform =
  process.platform === "win32"
    ? "windows"
    : process.platform === "darwin"
      ? "macos"
      : process.platform === "linux"
        ? "linux"
        : undefined;

const arch =
  process.arch === "x64"
    ? "x86_64"
    : process.arch === "arm64"
      ? "aarch64"
      : undefined;

export async function activate(context: ExtensionContext) {
  if (!platform) {
    await window.showErrorMessage(
      `Unsupported operating system platform: ${process.platform}.`,
    );
    return;
  }

  if (!arch) {
    await window.showErrorMessage(
      `Unsupported CPU architecture: ${process.arch}.`,
    );
    return;
  }

  const serverCommand = context.asAbsolutePath(
    path.join(
      "node_modules",
      "@kdblint",
      "kdblint",
      "dist",
      platform,
      arch,
      "kdblint",
    ),
  );
  const serverOptions: ServerOptions = {
    run: { command: serverCommand, transport: TransportKind.stdio },
    debug: { command: serverCommand, transport: TransportKind.stdio },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: "file", language: "k" },
      { scheme: "file", language: "q" },
    ],
  };

  client = new LanguageClient(
    "kdbLintLanguageServer",
    "kdbLint Language Server",
    serverOptions,
    clientOptions,
  );

  await client.start();
}

export async function deactivate() {
  if (!client) {
    return undefined;
  }

  await client.stop();
}
