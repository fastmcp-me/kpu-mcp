import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root
dotenv.config({ path: path.resolve(__dirname, ".env") });

const KPU_API_KEY = process.env.KPU_API_KEY;

const API_SERVER = "https://keywordspeopleuse.com/api";

// Create server instance
const server = new McpServer({
  name: "keywordspeopleuse",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function makeApiRequest(url) {
  const headers = {
    "x-api-key": KPU_API_KEY,
    Accept: "application/json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error making API request:", error);
    return null;
  }
}

// People Also Ask
server.tool(
  "people-also-ask",
  "Get People Also Ask questions for a given query",
  {
    q: z
      .string()
      .min(2)
      .describe("A query to use for getting People Also Ask questions"),
    hl: z
      .string()
      .length(2)
      .default("en")
      .describe("Two-letter language code (e.g. en, fr, es, de)"),
    gl: z
      .string()
      .length(2)
      .default("us")
      .describe("Two-letter country code (e.g. us, uk, ca, in, au)"),
  },
  async ({ q, hl = "en", gl = "us" }) => {
    const url = `${API_SERVER}/alsoask?q=${encodeURIComponent(
      q
    )}&hl=${hl}&gl=${gl}`;
    const result = await makeApiRequest(url);

    if (!result || !result.result) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve data",
          },
        ],
      };
    }

    const questions = [];

    result.result?.children?.forEach((obj) => {
      questions.push(obj.question);
      obj.children?.forEach((obj2) => {
        questions.push(obj2.question);
      });
    });

    if (questions.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No questions found for ${q}`,
          },
        ],
      };
    }
    const text = `People Also Ask questions for ${q}:\n\n${questions.join(
      "\n"
    )}`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }
);

// Google Autocomplete
server.tool(
  "google-autocomplete",
  "Get Google Autocomplete suggestions for a given query",
  {
    q: z
      .string()
      .min(2)
      .describe("A query to use for getting Google Autocomplete suggestions"),
    hl: z
      .string()
      .length(2)
      .default("en")
      .describe("Two-letter language code (e.g. en, fr, es, de)"),
    gl: z
      .string()
      .length(2)
      .default("us")
      .describe("Two-letter country code (e.g. us, uk, ca, in, au)"),
  },
  async ({ q, hl = "en", gl = "us" }) => {
    const url = `${API_SERVER}/suggestions?q=${encodeURIComponent(
      q
    )}&hl=${hl}&gl=${gl}`;
    const result = await makeApiRequest(url);

    if (!result || !result.result) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve data",
          },
        ],
      };
    }

    const questions = [];

    result.result?.children?.forEach((obj) => {
      obj.questions?.forEach((question) => {
        questions.push(question);
      });
    });

    if (questions.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No questions found for ${q}`,
          },
        ],
      };
    }
    const text = `Google Autocomplete suggestions for ${q}:\n\n${questions.join(
      "\n"
    )}`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }
);

// Forums
server.tool(
  "forums",
  "Get Reddit and Quora questions for a given query",
  {
    q: z
      .string()
      .min(2)
      .describe("A query to use for getting Reddit and Quora questions"),
    hl: z
      .string()
      .length(2)
      .default("en")
      .optional()
      .describe("Two-letter language code (e.g. en, fr, es, de)"),
    gl: z
      .string()
      .length(2)
      .default("us")
      .optional()
      .describe("Two-letter country code (e.g. us, uk, ca, in, au)"),
  },
  async ({ q, hl = "en", gl = "us" }) => {
    const url = `${API_SERVER}/forums?q=${encodeURIComponent(
      q
    )}&hl=${hl}&gl=${gl}`;
    const result = await makeApiRequest(url);

    if (!result || !result.result) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve data",
          },
        ],
      };
    }

    const redditQuestions = [];
    const quoraQuestions = [];

    result.result?.children?.[0]?.children.forEach((obj) => {
      redditQuestions.push(obj.name);
    });

    result.result?.children?.[1]?.children.forEach((obj) => {
      quoraQuestions.push(obj.name);
    });

    if (redditQuestions.length === 0 && quoraQuestions.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No questions found for ${q}`,
          },
        ],
      };
    }
    const text =
      `Questions for ${q}:\n\n` +
      `Reddit:\n\n${redditQuestions.join("\n")}\n\n` +
      `Quora:\n\n${quoraQuestions.join("\n")}`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }
);

// Semantic keywords
server.tool(
  "semantic-keywords",
  "Get Semantic (similar, related) keywords for a given query",
  {
    q: z
      .string()
      .min(2)
      .describe("A query to use for getting semantic keywords"),
    hl: z
      .string()
      .length(2)
      .default("en")
      .describe("Two-letter language code (e.g. en, fr, es, de)"),
    gl: z
      .string()
      .length(2)
      .default("us")
      .describe("Two-letter country code (e.g. us, uk, ca, in, au)"),
  },
  async ({ q, hl = "en", gl = "us" }) => {
    const url = `${API_SERVER}/semantic_keywords?q=${encodeURIComponent(
      q
    )}&hl=${hl}&gl=${gl}`;
    const result = await makeApiRequest(url);

    if (!result || !result.result) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve data",
          },
        ],
      };
    }

    const questions = [];

    result.result?.children?.forEach((obj) => {
      obj.children?.forEach((question) => {
        questions.push(question);
      });
    });

    if (questions.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No keywords found for ${q}`,
          },
        ],
      };
    }
    const text = `Semantically related keywords for ${q}:\n\n${questions.join(
      "\n"
    )}`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }
);

async function main() {
  if (!KPU_API_KEY) {
    throw new Error("Paste KPU_API_KEY inside the .env file");
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("KeywordsPeopleUse MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
