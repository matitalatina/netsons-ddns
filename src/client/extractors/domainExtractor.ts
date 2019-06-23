export class DomainExtractor {
    fromHtml(html: string): IDnsEntry[] {
        const entries = html.match(/[\t\s]+var smartyrrdb = .*]/);
        if (!entries || entries.length < 1) {
            throw Error('DNS Entries not found');
        }
        return JSON.parse(entries[0].split('var smartyrrdb = ')[1]);
    }
}