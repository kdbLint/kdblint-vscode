import * as path from "path";
import { ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  const serverModule = context.asAbsolutePath(path.join("dist", "server.js"));
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc },
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

  return client.start();
}

export function deactivate() {
  if (!client) {
    return undefined;
  }

  return client.stop();
}
