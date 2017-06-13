require! './test.ls': {expect}
require! '..': LineSpliter

suite \LineSpliter

test '\\n1\\n\\r2\\r\\n' ->
    spliter = new LineSpliter
    expect spliter.push '\n1\n\r2\r\n'
    .to.eql ['', \1, '', \2]
    expect spliter.flush!
    .to.eql ['']

test '\\n1\\n\\r2\\r\\n (no CR)' ->
    spliter = new LineSpliter {+noCR}
    expect spliter.push '\n1\n\r2\r\n'
    .to.eql ['', \1, '\r2']
    expect spliter.flush!
    .to.eql ['']

test '\\r123' ->
    spliter = new LineSpliter
    expect spliter.push '\r123'
    .to.eql ['']
    expect spliter.flush!
    .to.eql ['123']

test '\\r123 (no CR)' ->
    spliter = new LineSpliter {+noCR}
    expect spliter.push '\r123'
    .to.eql []
    expect spliter.flush!
    .to.eql ['\r123']
