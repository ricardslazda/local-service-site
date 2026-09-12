import { localeCodes } from '../../../src/site.ts';
import type { Check, Finding, Page } from '../dist.ts';
import { finding } from '../dist.ts';

import { internalPath } from './links.ts';

function bodyLinks(page: Page): Set<string> {
    return new Set(
        page
            .$('main a[href]')
            .toArray()
            .map((element) => internalPath(page.$(element).attr('href') ?? ''))
            .filter((path): path is string => path !== undefined),
    );
}

export const mesh: Check = ({ pages }) => {
    const indexable = pages.filter((page) => page.indexable);
    const findings: Finding[] = [];

    for (const locale of localeCodes) {
        const ofType = (type: Page['type']) =>
            indexable.filter(
                (page) => page.locale === locale && page.type === type,
            );
        const services = ofType('service');
        const locations = ofType('location');
        const jobs = ofType('job');
        const linksOf = new Map(
            [...services, ...locations, ...jobs].map((page) => [
                page.path,
                bodyLinks(page),
            ]),
        );
        const links = (page: Page) => linksOf.get(page.path) ?? new Set();

        for (const town of locations) {
            for (const service of services) {
                if (!links(town).has(service.path)) {
                    findings.push(
                        finding(
                            'mesh',
                            town.path,
                            `does not link to ${service.path} from its body`,
                        ),
                    );
                }
            }
        }

        for (const service of services) {
            for (const town of locations) {
                if (!links(service).has(town.path)) {
                    findings.push(
                        finding(
                            'mesh',
                            service.path,
                            `does not link to ${town.path} from its body`,
                        ),
                    );
                }
            }
        }

        for (const job of jobs) {
            const parents = {
                service: services.filter((page) => links(page).has(job.path)),
                location: locations.filter((page) => links(page).has(job.path)),
            };

            if (parents.service.length === 0) {
                findings.push(
                    finding(
                        'mesh',
                        job.path,
                        'is not linked from the body of any service page',
                    ),
                );
            }

            for (const [role, pages] of Object.entries(parents)) {
                for (const parent of pages) {
                    if (!links(job).has(parent.path)) {
                        findings.push(
                            finding(
                                'mesh',
                                job.path,
                                `does not link back to its ${role} page ${parent.path}`,
                            ),
                        );
                    }
                }
            }
        }
    }

    return findings;
};
