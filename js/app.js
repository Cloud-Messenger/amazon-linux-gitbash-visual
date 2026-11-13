const $=s=>document.querySelector(s);let cur=0,timer=null,beginner=true,conn=false,locked=false,H=[],hi=0;
const ID="ip-172-31-24-87",NODES=["Windows+Git Bash","OpenSSH client","PEM key","Security Group","EC2 AL2023","NGINX","Website"];
$('#map').insertAdjacentHTML('afterbegin',NODES.map((n,i)=>`<g id="n${i}"><rect x="${8+i*127}" y="60" width="115" height="70" rx="10"/><text x="${65+i*127}" y="100">${n}</text></g>`).join(''));
function go(i){cur=Math.max(0,Math.min(8,i));$('#steps').innerHTML=STEPS.map((s,k)=>`<li data-i="${k}" class="${k==cur?'active':''} ${k<cur?'done':''}"><b>${k<cur?'✔':k+1}</b>${s.t}</li>`).join('');
const s=STEPS[cur];$('#card').innerHTML=`<h3>Step ${cur+1}: ${s.t}</h3><p>${beginner?s.b:s.x}</p><p class="muted">Practical command:</p><pre>${s.c.replace(/</g,'&lt;')}</pre><p>Expected: <code>${s.o}</code></p><p>⚠ ${s.tr}</p><p>🎤 ${s.q}</p>`;
const p=Math.round((cur+1)/9*100);$('#prog').style.width=p+'%';$('#pct').textContent=p+'% complete';
document.querySelectorAll('svg g').forEach((g,k)=>g.classList.toggle('on',s.n.includes(k)));$('#done').hidden=cur<8;
const sg={5:["cd ~/Downloads","ls -l"],6:["chmod 400 cloud-messenger-key.pem","ssh -i cloud-messenger-key.pem ec2-user@203.0.113.25"],7:["whoami","uname -a","df -h","free -m","uptime","sudo dnf update -y"],8:["sudo dnf install nginx -y","sudo systemctl enable --now nginx","sudo systemctl status nginx","curl -I http://localhost"]}[cur]||["cd ~/Downloads","ls -l","chmod 400 cloud-messenger-key.pem","ssh -i cloud-messenger-key.pem ec2-user@203.0.113.25"];
$('#sugg').innerHTML=sg.map(c=>`<button>${c}</button>`).join('');}
function stop(){clearInterval(timer);timer=null;$('#play').textContent='▶ Autoplay'}
$('#play').onclick=()=>{if(timer)return stop();$('#play').textContent='⏸ Pause';timer=setInterval(()=>{cur>=8?stop():go(cur+1)},5000)};
$('#next').onclick=()=>go(cur+1);$('#prev').onclick=()=>go(cur-1);$('#reset').onclick=()=>{stop();go(0);tReset()};
$('#steps').onclick=e=>{const l=e.target.closest('li');if(l){stop();go(+l.dataset.i)}};
$('#mode').onclick=()=>{beginner=!beginner;$('#mode').textContent='Mode: '+(beginner?'Beginner':'Technical');go(cur)};
$('#theme').onclick=()=>{const d=document.documentElement;d.dataset.theme=d.dataset.theme=='dark'?'light':'dark'};
const L={whoami:"ec2-user",hostname:ID+".ap-south-1.compute.internal",pwd:"/home/ec2-user","ls -la":"total 12\ndrwx------ 2 ec2-user ec2-user 83 .\n-rw-r--r-- 1 ec2-user ec2-user 18 .bash_logout","uname -a":"Linux "+ID+" 6.1.x #1 SMP x86_64 GNU/Linux","cat /etc/os-release":'NAME="Amazon Linux"\nVERSION="2023"\nID="amzn"',"df -h":"Filesystem  Size Used Avail Use% Mounted on\n/dev/xvda1  8.0G 1.6G 6.4G  20% /","free -m":"       total used free\nMem:     949  180  520","uptime":" 10:02:11 up 4 min, 1 user, load average: 0.00","ip addr":"2: ens5: <BROADCAST,MULTICAST,UP> inet 172.31.24.87/20","sudo dnf update -y":"Last metadata check done.\nDependencies resolved. Nothing to do.\nComplete!","sudo dnf install nginx -y":"Installing: nginx\nInstalled: nginx\nComplete!","sudo systemctl enable --now nginx":"Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service","sudo systemctl status nginx":"● nginx.service - nginx\n   Active: active (running)\n   Listening on :80","curl -I http://localhost":"HTTP/1.1 200 OK\nServer: nginx"};
const X={whoami:"Shows the current user.",hostname:"Server name.",pwd:"Current directory.","ls -la":"Lists all files with permissions.","uname -a":"Kernel info.","cat /etc/os-release":"OS identity.","df -h":"Disk space.","free -m":"Memory in MB.",uptime:"Time since boot and load.","ip addr":"Network interfaces.","sudo dnf update -y":"DNF is the AL2023 package manager.","sudo systemctl status nginx":"Checks the service state.","curl -I http://localhost":"Tests NGINX locally."};
const out=$('#out'),inp=$('#in');
function ps(){$('#ps').textContent=conn?`[ec2-user@${ID} ~]$`:'MINGW64 ~/Downloads $'}
function tReset(){conn=false;locked=false;out.textContent="Git Bash (simulated). No real commands run.\n";ps()}
function run(c){c=c.trim();out.textContent+=$('#ps').textContent+' '+c+'\n';if(c){H.push(c);hi=H.length}let r='',e=X[c]||'';
if(c=='clear'){out.textContent='';ps();return}
if(!conn){if(c=='cd ~/Downloads')e='Change directory (Git Bash path).';
else if(c=='ls -l'){r=(locked?'-r--------':'-rw-r--r--')+' 1 CloudMessenger 1675 cloud-messenger-key.pem';e='Lists files with permissions.'}
else if(c=='chmod 400 cloud-messenger-key.pem'){locked=true;e='Owner read-only; SSH requires this.'}
else if(/^ssh -i \S+\.pem ec2-user@\S+$/.test(c)){if(!locked){r='WARNING: UNPROTECTED PRIVATE KEY FILE!\nPermissions too open.\nec2-user@host: Permission denied (publickey).';e='Run chmod 400 first.'}
else{conn=true;r="The authenticity of host can't be established.\nVerify the fingerprint via a trusted source, then accept.\nWarning: Permanently added host.\n\n   ,     #_\n   ~\\_  ####_   Amazon Linux 2023\n";e='Key authenticated; you are in Linux.'}}
else if(/^ssh /.test(c)){r='Permission denied (publickey). Use: ssh -i <key>.pem ec2-user@<IP>';e='Check user, key, IP.'}
else if(c)r='bash: '+c+': not available before SSH (simulated)'}
else if(c=='exit'){conn=false;r='logout'}else r=L[c]!==undefined?L[c]:c?'bash: '+c+': command not found (simulated)':'';
if(r)out.textContent+=r+'\n';if(e)$('#exp').textContent='💡 '+e;ps();$('#term').scrollTop=1e9}
inp.onkeydown=e=>{if(e.key=='Enter'){run(inp.value);inp.value=''}else if(e.key=='ArrowUp'&&hi>0)inp.value=H[--hi];else if(e.key=='ArrowDown')inp.value=H[++hi]||''};
$('#sugg').onclick=e=>{if(e.target.tagName!='BUTTON')return;const c=e.target.textContent;inp.value='';let k=0;const t=setInterval(()=>{inp.value=c.slice(0,++k);if(k>=c.length){clearInterval(t);setTimeout(()=>{run(c);inp.value=''},250)}},25)};
$('#clr').onclick=()=>{out.textContent='';ps()};$('#trs').onclick=tReset;
$('#tb').innerHTML=TROUBLE.map((t,i)=>`<button data-i="${i}">${i+1}. ${t[0]}</button>`).join('');
$('#tb').onclick=e=>{const b=e.target.closest('button');if(!b)return;const t=TROUBLE[b.dataset.i];document.querySelectorAll('#tb button').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');
$('#td').innerHTML=`<h3>${t[0]}</h3><p><b>Root cause:</b> ${t[1]}</p><p><b>Diagnose:</b> <code>${t[3]}</code></p><p><b>Fix:</b> ${t[2]}</p><p><b>Verify:</b> retry the connection or <code>curl -I http://&lt;IP&gt;</code></p><p><b>Interview:</b> name the symptom, the layer it lives in, then your fix.</p>`};
$('#td').textContent='Select an incident above.';tReset();go(0);
