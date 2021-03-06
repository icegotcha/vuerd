import { html, customElement, property } from "lit-element";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { EditorElement } from "./EditorElement";
import { Logger } from "@src/core/Logger";
import { Bus } from "@src/core/Event";
import { Menu, createContextmenuGeneratorCode } from "@src/core/Contextmenu";
import { hljs, HighlightKey } from "@src/core/Highlight";
import { createGeneratorCode } from "@src/core/GeneratorCode";

const LanguageMap: { [key: string]: HighlightKey } = {
  GraphQL: "graphql",
  "C#": "csharp",
  Java: "java",
  Kotlin: "kotlin",
  TypeScript: "typescript",
  JPA: "java",
  Scala: "scala",
};

@customElement("vuerd-generator-code")
class GeneratorCode extends EditorElement {
  @property({ type: Boolean })
  contextmenu = false;

  private contextmenuX = 0;
  private contextmenuY = 0;
  private menus: Menu[] = [];

  connectedCallback() {
    super.connectedCallback();
    Logger.debug("GeneratorCode connectedCallback");
    const { store, eventBus } = this.context;
    this.subscriptionList.push(
      eventBus.on(Bus.ERD.contextmenuEnd).subscribe(this.onContextmenuEnd),
      store.observe(store.canvasState, (name) => {
        switch (name) {
          case "language":
          case "tableCase":
          case "columnCase":
            this.requestUpdate();
            break;
        }
      })
    );
  }

  render() {
    Logger.debug("GeneratorCode render");
    const { language } = this.context.store.canvasState;
    const code = createGeneratorCode(this.context.store);
    const codeHTML = hljs.highlight(LanguageMap[language], code).value;
    return html`
      <div
        class="vuerd-generator-code vuerd-scrollbar hljs"
        contenteditable="true"
        spellcheck="false"
        @mousedown=${this.onMousedown}
        @contextmenu=${this.onContextmenu}
      >
        ${unsafeHTML(codeHTML)}
      </div>
      ${this.contextmenu
        ? html`
            <vuerd-contextmenu
              .menus=${this.menus}
              .x=${this.contextmenuX}
              .y=${this.contextmenuY}
            ></vuerd-contextmenu>
          `
        : ""}
    `;
  }

  private onContextmenuEnd = (event: Event) => {
    this.contextmenu = false;
  };

  private onContextmenu(event: MouseEvent) {
    event.preventDefault();
    const { store } = this.context;
    this.contextmenuX = event.x;
    this.contextmenuY = event.y;
    this.menus = createContextmenuGeneratorCode(store);
    this.contextmenu = true;
  }
  private onMousedown(event: MouseEvent) {
    const el = event.target as HTMLElement;
    if (!el.closest(".vuerd-contextmenu")) {
      this.contextmenu = false;
    }
  }
}
