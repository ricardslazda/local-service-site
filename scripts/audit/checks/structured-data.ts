import { businessId } from '../../../src/lib/graph.ts';
import type { Check, Finding, Page } from '../dist.ts';
import { finding } from '../dist.ts';

type Node = Record<string, unknown>;

function isReference(value: Node): boolean {
    return (
        typeof value['@id'] === 'string' &&
        Object.keys(value).every((key) => key === '@id' || key === 'name')
    );
}

function walk(
    value: unknown,
    declared: Set<string>,
    referenced: Set<string>,
): void {
    if (Array.isArray(value)) {
        value.forEach((item) => walk(item, declared, referenced));

        return;
    }

    if (!value || typeof value !== 'object') {
        return;
    }

    const node = value as Node;

    if (typeof node['@id'] === 'string') {
        (isReference(node) ? referenced : declared).add(node['@id']);
    }

    Object.values(node).forEach((child) => walk(child, declared, referenced));
}

function graphsOf(page: Page): { graphs: unknown[]; findings: Finding[] } {
    const graphs: unknown[] = [];
    const findings: Finding[] = [];

    page.$('script[type="application/ld+json"]').each((_, element) => {
        try {
            graphs.push(JSON.parse(page.$(element).text()));
        } catch (error) {
            findings.push(
                finding(
                    'structured-data',
                    page.path,
                    `has JSON-LD that does not parse: ${(error as Error).message}`,
                ),
            );
        }
    });

    return { graphs, findings };
}

export const structuredData: Check = ({ pages }) =>
    pages
        .filter((page) => page.indexable)
        .flatMap((page) => {
            const { graphs, findings } = graphsOf(page);
            const declared = new Set<string>();
            const referenced = new Set<string>();

            walk(graphs, declared, referenced);

            if (!declared.has(businessId)) {
                findings.push(
                    finding(
                        'structured-data',
                        page.path,
                        `declares no business node with @id ${businessId}`,
                    ),
                );
            }

            for (const id of referenced) {
                if (!declared.has(id)) {
                    findings.push(
                        finding(
                            'structured-data',
                            page.path,
                            `points at ${id}, which no node on the page declares`,
                        ),
                    );
                }
            }

            return findings;
        });
