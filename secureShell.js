(async () => {
  const {NodeSSH} = require('node-ssh')
  const ssh = new NodeSSH();
    
  const prompt = require('prompt');
  prompt.start();

  await new Promise((resolve, reject) => { 
    prompt.get(['host', 'username', {name: 'password', hidden: true}], function (err, result) {
      if (err) {
        console.error(err);
        reject(err);
        return
      }
      (async () => {
        await ssh.connect({
          host: result.host,
          username: result.username,
          password: result.password,
          compress: true,
        });
      })().then(resolve);
    });
  });

  const pipeStream = stream => {
    const {stdin, stdout, stderr} = process
    const {isTTY} = stdout

    if (isTTY && stdin.setRawMode) stdin.setRawMode(true)

    stream.pipe(stdout)
    stream.stderr.pipe(stderr)
    stdin.pipe(stream)

    const onResize = isTTY && (() => stream.setWindow(stdout.rows, stdout.columns, null, null))
    if (isTTY) {
      stream.once('data', onResize)
      process.stdout.on('resize', onResize)
    }
    stream.on('close', () => {
      if (isTTY) process.stdout.removeListener('resize', onResize)
      stream.unpipe()
      stream.stderr.unpipe()
      stdin.unpipe()
      if (stdin.setRawMode) stdin.setRawMode(false)
      stdin.unref()
    })
  }

  await new Promise((resolve, reject) => {
    ssh.connection.shell({term: process.env.TERM || 'vt100'}, (err, stream) => {
      if (err) {
        reject(err)
        return
      }
      pipeStream(stream)
      stream.on('close', () => resolve(true))
    })
  })

  ssh.dispose()
})()

