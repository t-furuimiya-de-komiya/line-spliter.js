const {StringDecoder} = require('string_decoder')
const {Transform} = require('stream')

const EOL_RE = /\r\n|[\r\n]/
const NOCR_RE = /\r?\n/


class LineSpliter
{
    constructor(opts)
    {
        this.opts = Object.assign({encoding: 'utf8'}, opts)
        this.decoder = new StringDecoder(this.opts.encoding)
        this.re = this.opts.noCR ? NOCR_RE : EOL_RE
        this.buf = ''
    }

    push(buf)
    {
        this.buf += this.decoder.write(buf)
        const lines = this.buf.split(this.re)
        this.buf = lines.pop()
        return lines
    }

    flush()
    {
        this.buf += this.decoder.end()
        const lines = this.buf.split(this.re)
        this.buf = ''
        return lines
    }
}


class LineSpliterStream extends Transform
{
    constructor(spliter)
    {
        super({readableObjectMode: true})
        this.spliter = spliter || new LineSpliter
    }

    _transform(chunk, enc, done)
    {
        this.pushLines(done, chunk)
    }

    _flush(done)
    {
        this.pushLines(done)
    }

    pushLines(done, chunk)
    {
        try {
            const lines = chunk ? this.spliter.push(chunk) : this.spliter.flush()
            for (let line of lines)
                this.push(line)
            done()
        } catch (err) {
            done(err)
        }
    }
}


module.exports = LineSpliter
LineSpliter.Stream = LineSpliterStream
