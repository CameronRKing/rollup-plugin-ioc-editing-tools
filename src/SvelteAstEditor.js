import * as recast from 'recast';
import posthtml from 'posthtml';
import { render } from './htmlrender.js';

const zephyrAttr = 'data-zephyr';

export default class SvelteAstEditor {
    constructor(text) {
        this.isDone = new Promise(resolve => {
            posthtml().process(text, { recognizeSelfClosing: true, closingSingleTag: 'slash', render }).then(results => {
                this.results = results;
                this.tree = results.tree;
                this.script = undefined;
                this.addParentsToHtmlTree();
                results.tree.match({ tag: 'script' }, node => {
                    this.scriptNode = node;
                    // node.content may be an array of strings instead of one string
                    // since the JS code is represented as a JS string, slashes need to be double-escaped
                    // else you get "unterminated string constant" errors 
                    // because the slashes get used up by the parser
                    let content = node.content.join('').replace(/\\/g, '\\\\');
                    this.script = recast.parse(content);
                    return node;
                });
                if (!this.script) this.script = recast.parse('');
                resolve();
            });
        });
    }

    addParentsToHtmlTree() {
        this.tree.walk(node => {
            if (!node.content) return node;
            node.content.forEach(child => {
                if (typeof child == 'object') child.parent = node;
            });
            return node;
        });
    }


    ready() {
        return this.isDone;
    }

    toString() {
        this.tree.match({ tag: 'script' }, node => {
            node.content = [recast.print(this.script, { quote: 'single', lineTerminator: '\n', tabWidth: 4, arrowParensAlways: true })
                .code
                // Recast seperates multiline object properties by an extra newline on both sides
                // https://github.com/benjamn/recast/issues/242
                // the author did it for personal preference and, after years of complaints, has not made it alterable
                .replace(/,\n\n/mg, ',\n')
                .replace(/{\n\n/mg, '{\n')
            ];
            return node;
        });
        return this.results.html;
    }

    // should probably be implemented in Zephyr.svelte
    addZephyrIds() {
        const nextId = () => {
            const nodes = this.filterHAST({ attrs: { [zephyrAttr]: /.*/ } });
            const ids = nodes.map(n => Number(n.attrs[zephyrAttr]));

            if (!ids.length) return 0;
            return Math.max.apply(null, ids) + 1;
        };

        let id = nextId();
        const addId = (node) => {
            if (['script', 'template', 'style'].includes(node.tag)) return node;

            if (!node.attrs) node.attrs = {};
            node.attrs[zephyrAttr] = id++;
            return node;
        }

        this.tree.match({ attrs: undefined }, addId);
        this.tree.match({ attrs: { [zephyrAttr]: undefined } }, addId);
    }

    removeZephyrIds() {
        this.filterHAST({ attrs: { [zephyrAttr]: /.*/ } })
            .forEach(node => node.attrs[zephyrAttr] = undefined);
    }

    filterHAST(filter) {
        const nodes = [];
        this.tree.match(filter, node => {
            nodes.push(node);
            return node;
        });
        return nodes;
    }

    getTagNodeBefore(contents, cursorPos) {
        // ideally I'd match the user's cursor position directly to a node in the AST via source code location info
        // however, it's not as easy as you might think. posthtml doesn't track location info,
        // and the parsers I've found that do track it don't have the render/manipulation functions I'd like
        // so we're going with a hack
        // we'll find the first tag previous to the user's cursor and count the number of same tags before it
        // then we'll search the tree and take the nth AST node with that tag
        const tags = contents.slice(0, cursorPos).match(/<\w+/g);
        const prevTags = tags.slice(0, -1);
        const lastTag = tags.slice(-1)[0];
        const numTagsBefore = prevTags.filter(tag => tag == lastTag).length;
        const tagNodes = cmp.filterHAST({ tag: lastTag.slice(1) });
        return tagNodes[numTagsBefore];
    }
}