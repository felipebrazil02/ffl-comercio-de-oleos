import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8'};
http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(503,{'Content-Type':'application/json'});return res.end(JSON.stringify({accepted:false,message:'O recebimento de orçamentos ainda não está configurado.'}));}
  try{
    let requested=decodeURIComponent(url.pathname);
    let file=path.resolve(root,'.'+requested);
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
    let stat=await fs.stat(file);
    if(stat.isDirectory()){
      if(!requested.endsWith('/')){res.writeHead(301,{Location:requested+'/'+url.search});return res.end();}
      file=path.join(file,'index.html');
    }
    const body=await fs.readFile(file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Robots-Tag':'noindex, nofollow','Cache-Control':'no-cache'});
    res.end(req.method==='HEAD'?undefined:body);
  }catch{
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex'});
    res.end(await fs.readFile(path.join(root,'404.html')).catch(()=>Buffer.from('Página não encontrada')));
  }
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
