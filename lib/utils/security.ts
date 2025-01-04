import { hash, compare } from "bcryptjs";
    import sanitize from 'sanitize-html';

    export async function hashPassword(password: string): Promise<string> {
      return hash(password, 12);
    }

    export async function verifyPassword(
      password: string,
      hashedPassword: string
    ): Promise<boolean> {
      return compare(password, hashedPassword);
    }

    export function sanitizeHtml(html: string): string {
      // Basic XSS prevention
      return sanitize(html, {
        allowedTags: sanitize.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitize.defaults.allowedAttributes,
          img: ['src', 'alt'],
        },
        allowedSchemes: ['http', 'https', 'ipfs'],
      });
    }

    export function validateInput(input: string): boolean {
      // Add input validation rules
      const hasSpecialChars = /[<>'"()]/.test(input);
      const hasValidLength = input.length <= 1000;
      return !hasSpecialChars && hasValidLength;
    }
