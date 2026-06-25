(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();const ze="ICFES_Extractor_DB",Re=1;let Y=null;function W(){return new Promise((t,e)=>{if(Y){t(Y);return}const o=indexedDB.open(ze,Re);o.onerror=a=>{console.error("Database error:",a.target.error),e(a.target.error)},o.onsuccess=a=>{Y=a.target.result,t(Y)},o.onupgradeneeded=a=>{const r=a.target.result;if(!r.objectStoreNames.contains("files")){const n=r.createObjectStore("files",{keyPath:"id",autoIncrement:!0});n.createIndex("area","area",{unique:!1}),n.createIndex("name","name",{unique:!1})}if(!r.objectStoreNames.contains("questions")){const n=r.createObjectStore("questions",{keyPath:"id",autoIncrement:!0});n.createIndex("area","area",{unique:!1}),n.createIndex("fileId","fileId",{unique:!1})}}})}async function ke(t){const e=await W();return new Promise((o,a)=>{const s=e.transaction(["files"],"readwrite").objectStore("files").add({name:t.name,size:t.size,area:t.area,uploadedAt:new Date().toISOString(),questionCount:t.questionCount||0});s.onsuccess=i=>o(i.target.result),s.onerror=i=>a(i.target.error)})}async function Me(t){const e=await W();return new Promise((o,a)=>{const s=e.transaction(["questions"],"readwrite").objectStore("questions").add({fileId:t.fileId?Number(t.fileId):null,area:t.area,headerText:t.headerText||"",bodyText:t.bodyText||"",options:{A:t.options.A||"",B:t.options.B||"",C:t.options.C||"",D:t.options.D||""},correctOption:t.correctOption||"",solutionExplanation:t.solutionExplanation||"",images:t.images||[],createdAt:new Date().toISOString()});s.onsuccess=i=>o(i.target.result),s.onerror=i=>a(i.target.error)})}async function z(t){const e=await W();return new Promise((o,a)=>{const i=e.transaction(["questions"],"readonly").objectStore("questions").index("area").getAll(t);i.onsuccess=c=>o(c.target.result),i.onerror=c=>a(c.target.error)})}async function je(t){const e=await W();return new Promise((o,a)=>{const s=e.transaction(["questions"],"readwrite").objectStore("questions").delete(Number(t));s.onsuccess=()=>o(),s.onerror=i=>a(i.target.error)})}function Ue(t){return t.replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\u00a0/g," ").trim()}function Qe(t){const e=new Set,o=/\bpreguntas\s+([0-9\s,ay\-a|de|al|del|la|las]+)/gi;let a;for(;(a=o.exec(t))!==null;){const n=a[1].match(/\d+/g);if(n&&n.length>=2){const s=a.index,i=Math.max(0,s-80),c=t.substring(i,s+a[0].length).toLowerCase(),d=/responda|conteste|lea|con base|de acuerdo|siguiente|grafic|tabl|texto|imagen|figura/i.test(c),g=/contiene|consta|presenta|evalúa|prueba de/i.test(c)&&!/responda|conteste/i.test(c);if(d&&!g){const l=n.map(Number),p=Math.min(...l),u=Math.max(...l);if(u-p<8)for(let x=p;x<=u;x++)e.add(x)}}}return e}function Ce(t,e={},o="pdf"){const a=Ue(t);console.log("=== TEXTO EXTRAÍDO DEL DOCUMENTO (PRIMEROS 1000 CARACTERES) ==="),console.log(a.substring(0,1e3)),console.log("===============================================================");const r=Qe(a);console.log("Números de preguntas excluidos globalmente:",Array.from(r));const n=/(?:^|\n)\s*(?:(?:[Pp]regunta\s+|[Nn]°\s*)([1-9][0-9]?|1[0-9]{2})\b\s*[\.\-\)\:]*|([1-9][0-9]?|1[0-9]{2})\s*[\.\-\)\:]+)(?!\d)\s*/g;let s;const i=[];for(;(s=n.exec(a))!==null;)i.push({index:s.index,number:s[1]||s[2],fullMatch:s[0]});if(console.log(`Coincidencias encontradas con regex principal: ${i.length}`),i.length===0){const p=/(?:^|\n)\s*([1-9][0-9]?)\s*[\.\-\)\:]+(?!\d)\s*/g;for(;(s=p.exec(a))!==null;)i.push({index:s.index,number:s[1],fullMatch:s[0]});console.log(`Coincidencias encontradas con regex fallback: ${i.length}`)}const c=[];let d="";for(let p=0;p<i.length;p++){const u=i[p].index,x=p+1<i.length?i[p+1].index:a.length,E=a.substring(u,x).trim(),y=parseInt(i[p].number,10);if(r.has(y)){console.log(`Skipped question ${y} because it belongs to a multi-question block.`);continue}let P=d;d="",p===0&&u>0&&(P=a.substring(0,u).trim());const oe=/(?:^|\s|\n)[Aa][\.\-\)]\s+([\s\S]*?)(?=(?:[Bb][\.\-\)]\s+)|$)/,X=/(?:^|\s|\n)[Bb][\.\-\)]\s+([\s\S]*?)(?=(?:[Cc][\.\-\)]\s+)|$)/,ae=/(?:^|\s|\n)[Cc][\.\-\)]\s+([\s\S]*?)(?=(?:[Dd][\.\-\)]\s+)|$)/,se=/(?:^|\s|\n)[Dd][\.\-\)]\s+([\s\S]*?)(?=(?:[A-Ea-e\d][\.\-\)]\s+)|$)/;let R=E.search(/(?:^|\s|\n)[Aa][\.\-\)]\s+/),w=E,I="",L="",m="",b="";if(R!==-1){w=E.substring(0,R).trim();const f=E.substring(R),$=f.match(oe),k=f.match(X),V=f.match(ae),K=f.match(se);$&&(I=$[1].trim()),k&&(L=k[1].trim()),V&&(m=V[1].trim()),K&&(b=K[1].trim())}const C=/(?:^|\n)(Responda la pregunta \d+|De acuerdo con|Con base en|Lea el siguiente|Texto:?|INFORMACIÓN)\b[\s\S]*/i,T=b.match(C);if(T){const f=b.indexOf(T[0]);d=b.substring(f).trim(),b=b.substring(0,f).trim()}let h=w.replace(/^(?:[Pp]regunta\s+|[Nn]°\s*|)\d+\s*[\.\-\)\:]*\s*/,"").trim();if(!I&&!L&&!m&&!b){const f=h.split(`
`).map($=>$.trim()).filter($=>$.length>0);f.length>=5&&(b=f.pop(),m=f.pop(),L=f.pop(),I=f.pop(),h=f.join(`
`))}const A=(P+" "+h).toLowerCase();if(/\bpreguntas\s+\d+/i.test(A)){console.log(`Skipped question ${y} during detailed checks.`);continue}let S="";I.startsWith("*")||I.endsWith("*")?(S="A",I=I.replace(/^\*|\*$/g,"").trim()):L.startsWith("*")||L.endsWith("*")?(S="B",L=L.replace(/^\*|\*$/g,"").trim()):m.startsWith("*")||m.endsWith("*")?(S="C",m=m.replace(/^\*|\*$/g,"").trim()):(b.startsWith("*")||b.endsWith("*"))&&(S="D",b=b.replace(/^\*|\*$/g,"").trim()),c.push({number:y,headerText:P,bodyText:h,options:{A:I,B:L,C:m,D:b},correctOption:S,images:[]})}const g=/(?:[Cc]lave de [Rr]espuestas|[Tt]abla de [Rr]espuestas|[Rr]espuestas):?\s*([\s\S]*)$/i,l=a.match(g);if(l){const p=l[1],u=/(\d+)\s*[\.\-\:\s]*\s*([A-Da-d])\b/g;let x;const E={};for(;(x=u.exec(p))!==null;)E[parseInt(x[1],10)]=x[2].toUpperCase();c.forEach(y=>{!y.correctOption&&E[y.number]&&(y.correctOption=E[y.number])})}return c}async function Ge(t,e){if(typeof pdfjsLib>"u")throw new Error("PDF.js library is not loaded. Please check CDN.");pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";const o=await pdfjsLib.getDocument({data:t}).promise,a=o.numPages;let r="";const n=[],s={};for(let c=1;c<=a;c++){e&&e(Math.round(c/a*50));const d=await o.getPage(c),g=await d.getTextContent();let l,p="";for(const u of g.items)l!==void 0&&Math.abs(u.transform[5]-l)>4&&(p+=`
`),p+=u.str+" ",l=u.transform[5];n.push(p),r+=`
`+p;try{const u=await He(d);u&&u.length>0&&(s[c]=u)}catch(u){console.warn(`Failed to extract images from page ${c}:`,u)}}e&&e(75);const i=Ce(r,s,"pdf");return i.forEach(c=>{for(let d=1;d<=a;d++)(n[d-1]||"").includes(c.bodyText.substring(0,Math.min(30,c.bodyText.length)))&&s[d]&&(c.images=c.images.concat(s[d]))}),e&&e(100),i}async function He(t){const e=await t.getOperatorList(),o=[];for(let a=0;a<e.fnArray.length;a++){const r=e.fnArray[a];if(r===pdfjsLib.OPS.paintImageXObject||r===pdfjsLib.OPS.paintInlineImageXObject){const n=e.argsArray[a][0];try{const s=await new Promise((i,c)=>{t.objs.get(n,d=>{d?i(d):c(new Error("Image object not found"))})});if(s&&s.data){const i=s.width,c=s.height,d=document.createElement("canvas");d.width=i,d.height=c;const g=d.getContext("2d"),l=g.createImageData(i,c);if(s.data.length===i*c*4)l.data.set(s.data);else if(s.data.length===i*c*3){let p=0,u=0;for(let x=0;x<i*c;x++)l.data[u]=s.data[p],l.data[u+1]=s.data[p+1],l.data[u+2]=s.data[p+2],l.data[u+3]=255,p+=3,u+=4}else continue;g.putImageData(l,0,0),o.push(d.toDataURL("image/png"))}}catch(s){console.warn("Error reading PDF image object:",s)}}}return o}async function We(t,e){if(typeof mammoth>"u")throw new Error("Mammoth.js library is not loaded. Please check CDN.");e&&e(30);const a=(await mammoth.convertToHtml({arrayBuffer:t})).value;e&&e(60);const n=new DOMParser().parseFromString(a,"text/html"),s=[];n.querySelectorAll("img").forEach(l=>{l.src&&l.src.startsWith("data:image")&&s.push(l.src)});const d=(await mammoth.extractRawText({arrayBuffer:t})).value;e&&e(80);const g=Ce(d,{},"docx");return s.length>0&&(g.forEach((l,p)=>{l.bodyText.toLowerCase().match(/(imagen|grafico|gráfico|figura|tabla)\s*(\d+|[a-zA-Z]?)/)&&l.images.push(s[p%s.length])}),g.some(l=>l.images.length===0)&&g.length===s.length&&g.forEach((l,p)=>{l.images.length===0&&l.images.push(s[p])})),e&&e(100),g}const ne={matematicas:"Matemáticas",lectura_critica:"Lectura Crítica",sociales_ciudadanas:"Sociales y Ciudadanas",ciencias_naturales:"Ciencias Naturales",ingles:"Inglés"};function Xe(t){const e=[...t];for(let o=e.length-1;o>0;o--){const a=Math.floor(Math.random()*(o+1));[e[o],e[a]]=[e[a],e[o]]}return e}async function Ve(t,e=30){const o=await z(t);if(o.length===0)throw new Error(`No hay preguntas guardadas en el área de ${ne[t]}.`);const a=Xe(o),r=a.slice(0,Math.min(e,a.length)),n=r.length<e?`Nota: Solo hay ${r.length} preguntas disponibles (se solicitaron ${e}).`:null;return{questions:r,warning:n}}async function Ke(t,e,o){const{Document:a,Packer:r,Paragraph:n,TextRun:s,AlignmentType:i,HeadingLevel:c,BorderStyle:d,LevelFormat:g,PageNumber:l,Header:p,Footer:u,PageBreak:x,WidthType:E}=window.docx,y=ne[e]||e,P=new Date().toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"}),oe={config:[{reference:"opciones",levels:[{level:0,format:g.UPPER_LETTER,text:"%1.",alignment:i.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]}]},X=(m=120)=>new n({children:[],spacing:{before:m,after:0}}),ae=()=>new n({children:[],border:{bottom:{style:d.SINGLE,size:4,color:"CCCCCC"}},spacing:{before:80,after:80}}),se=new p({children:[new n({children:[new s({text:`EVALUACIÓN ICFES — ${y.toUpperCase()}`,font:"Arial",size:18,bold:!0,color:"3B3B3B"}),new s({text:`	${P}`,font:"Arial",size:18,color:"888888"})],tabStops:[{type:"right",position:9360}],border:{bottom:{style:d.SINGLE,size:4,color:"6366F1"}}})]}),R=new u({children:[new n({children:[new s({text:"ICFES Extractor  •  Página ",font:"Arial",size:16,color:"888888"}),new s({children:[l.CURRENT],font:"Arial",size:16,color:"888888"}),new s({text:" de ",font:"Arial",size:16,color:"888888"}),new s({children:[l.TOTAL_PAGES],font:"Arial",size:16,color:"888888"})],alignment:i.CENTER,border:{top:{style:d.SINGLE,size:4,color:"DDDDDD"}}})]}),w=[new n({children:[new s({text:`EVALUACIÓN — ${y.toUpperCase()}`,font:"Arial",size:36,bold:!0,color:"1E1E2E"})],alignment:i.CENTER,spacing:{before:0,after:200}}),new n({children:[new s({text:`Fecha: ${P}    |    Número de preguntas: ${t.length}`,font:"Arial",size:20,color:"555555"})],alignment:i.CENTER,spacing:{before:0,after:60}}),new n({children:[new s({text:"Nombre: ________________________________________    Grado: __________",font:"Arial",size:22,color:"333333"})],spacing:{before:100,after:200}}),ae()];if(t.forEach((m,b)=>{const C=(m.bodyText||"").split(`
`).filter(h=>h.trim());w.push(X(280)),w.push(new n({children:[new s({text:`${b+1}. `,font:"Arial",size:24,bold:!0,color:"6366F1"}),new s({text:C[0]||"",font:"Arial",size:22})],spacing:{before:0,after:80}}));for(let h=1;h<C.length;h++)w.push(new n({children:[new s({text:C[h],font:"Arial",size:22})],indent:{left:360},spacing:{before:0,after:60}}));m.headerText&&m.headerText.trim()&&w.push(new n({children:[new s({text:m.headerText.trim(),font:"Arial",size:20,italics:!0,color:"555555"})],indent:{left:360},spacing:{before:80,after:80},border:{left:{style:d.SINGLE,size:8,color:"6366F1"}}})),["A","B","C","D"].forEach(h=>{const A=m.options&&m.options[h]?m.options[h]:"";if(!A)return;const B=o&&m.correctOption===h;w.push(new n({children:[new s({text:`${h}.  ${A}`,font:"Arial",size:21,bold:B,color:B?"10B981":"222222"})],indent:{left:520,hanging:300},spacing:{before:60,after:0}}))}),o&&m.correctOption&&w.push(new n({children:[new s({text:`✔ Respuesta: ${m.correctOption}`,font:"Arial",size:19,bold:!0,color:"10B981"})],indent:{left:520},spacing:{before:80,after:0}}))}),o){w.push(X(400)),w.push(new n({children:[new x]})),w.push(new n({children:[new s({text:"TABLA DE RESPUESTAS",font:"Arial",size:28,bold:!0,color:"1E1E2E"})],alignment:i.CENTER,spacing:{before:0,after:300}}));const{Table:m,TableRow:b,TableCell:C,ShadingType:T}=window.docx,h={style:d.SINGLE,size:4,color:"DDDDDD"},A={top:h,bottom:h,left:h,right:h},B={size:936,type:E.DXA};["N°",...Array.from({length:9},(f,$)=>String($+1))].map(f=>new C({borders:A,width:B,shading:{fill:"6366F1",type:T.CLEAR},margins:{top:80,bottom:80,left:80,right:80},children:[new n({children:[new s({text:f,font:"Arial",size:18,bold:!0,color:"FFFFFF"})],alignment:i.CENTER})]}));const S=[];for(let f=0;f<Math.ceil(t.length/10);f++){const $=f*10,k=Array.from({length:10},(F,Ne)=>$+Ne),V=[new C({borders:A,width:B,shading:{fill:"F3F4F6",type:T.CLEAR},margins:{top:80,bottom:80,left:80,right:80},children:[new n({children:[new s({text:"N°",font:"Arial",size:17,bold:!0})],alignment:i.CENTER})]}),...k.map(F=>new C({borders:A,width:B,shading:{fill:"F9FAFB",type:T.CLEAR},margins:{top:80,bottom:80,left:80,right:80},children:[new n({children:[new s({text:F<t.length?String(F+1):"",font:"Arial",size:17})],alignment:i.CENTER})]}))],K=[new C({borders:A,width:B,shading:{fill:"F3F4F6",type:T.CLEAR},margins:{top:80,bottom:80,left:80,right:80},children:[new n({children:[new s({text:"Rta.",font:"Arial",size:17,bold:!0})],alignment:i.CENTER})]}),...k.map(F=>new C({borders:A,width:B,shading:{fill:"ECFDF5",type:T.CLEAR},margins:{top:80,bottom:80,left:80,right:80},children:[new n({children:[new s({text:F<t.length?t[F].correctOption||"—":"",font:"Arial",size:18,bold:!0,color:"10B981"})],alignment:i.CENTER})]}))];S.push(new b({children:V})),S.push(new b({children:K}))}w.push(new m({width:{size:9360,type:E.DXA},columnWidths:Array(10).fill(936),rows:S}))}const I=new a({numbering:oe,styles:{default:{document:{run:{font:"Arial",size:22}}}},sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1260,bottom:1440,left:1260}}},headers:{default:se},footers:{default:R},children:w}]}),L=await r.toBlob(I);Je(L,`Evaluacion_${y}_${Ie()}.docx`)}function Ye(t,e,o){const a=window.XLSX,r=ne[e]||e,n=[["N°","Enunciado","Opción A","Opción B","Opción C","Opción D",...o?["Respuesta Correcta"]:[]]];t.forEach((c,d)=>{var l,p,u,x;const g=[d+1,(c.bodyText||"").replace(/\n/g," ").trim(),((l=c.options)==null?void 0:l.A)||"",((p=c.options)==null?void 0:p.B)||"",((u=c.options)==null?void 0:u.C)||"",((x=c.options)==null?void 0:x.D)||"",...o?[c.correctOption||""]:[]];n.push(g)});const s=a.utils.book_new(),i=a.utils.aoa_to_sheet(n);i["!cols"]=[{wch:5},{wch:60},{wch:30},{wch:30},{wch:30},{wch:30},...o?[{wch:18}]:[]],a.utils.book_append_sheet(s,i,r.substring(0,31)),a.writeFile(s,`Evaluacion_${r}_${Ie()}.xlsx`)}function Ze(t,e,o){const a=ne[e]||e,r=new Date().toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"});let n=`
    <!DOCTYPE html><html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Evaluación ${a}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: Arial, sans-serif;
          font-size: 11pt;
          color: #1a1a1a;
          background: #fff;
          padding: 0;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #6366f1;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .page-header h1 { font-size: 16pt; color: #1e1e2e; }
        .page-header span { font-size: 10pt; color: #888; }
        .meta-row {
          display: flex;
          gap: 40px;
          margin-bottom: 10px;
          font-size: 10pt;
          color: #555;
        }
        .name-line {
          border: none;
          border-bottom: 1px solid #aaa;
          padding-bottom: 2px;
          display: inline-block;
          width: 260px;
        }
        .divider { border: none; border-top: 1px solid #ddd; margin: 10px 0; }
        .question-block { margin-bottom: 18px; page-break-inside: avoid; }
        .q-num { font-weight: bold; color: #6366f1; }
        .q-body { margin: 4px 0 6px 0; line-height: 1.5; }
        .q-header {
          font-style: italic;
          color: #555;
          border-left: 3px solid #6366f1;
          padding-left: 8px;
          margin: 4px 0 8px 0;
          font-size: 10pt;
        }
        .options { margin-left: 16px; }
        .option {
          padding: 2px 0;
          line-height: 1.5;
        }
        .option.correct { font-weight: bold; color: #10b981; }
        .correct-badge {
          font-size: 9pt;
          color: #10b981;
          font-weight: bold;
          margin-left: 16px;
          margin-top: 2px;
        }
        .answer-table-section { page-break-before: always; margin-top: 20px; }
        .answer-table-section h2 { font-size: 14pt; text-align: center; margin-bottom: 16px; color: #1e1e2e; }
        table.claves {
          border-collapse: collapse;
          width: 100%;
          font-size: 10pt;
        }
        table.claves th {
          background: #6366f1;
          color: white;
          padding: 6px;
          text-align: center;
        }
        table.claves td {
          border: 1px solid #ddd;
          padding: 6px;
          text-align: center;
        }
        table.claves tr:nth-child(even) td { background: #f9f9f9; }
        .ans-cell { color: #10b981; font-weight: bold; }
        .footer { position: fixed; bottom: 12px; width: 100%; text-align: center; font-size: 9pt; color: #aaa; }
        @media print {
          @page { size: Letter; margin: 2cm 2cm 2.5cm 2cm; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="page-header">
        <div>
          <h1>EVALUACIÓN — ${a.toUpperCase()}</h1>
          <div class="meta-row" style="margin-top:8px;">
            <span>Fecha: ${r}</span>
            <span>Preguntas: ${t.length}</span>
          </div>
          <div class="meta-row">
            <span>Nombre: <span class="name-line"></span></span>
            <span>Grado: __________</span>
          </div>
        </div>
      </div>
      <hr class="divider">
  `;if(t.forEach((i,c)=>{n+='<div class="question-block">',n+=`<p><span class="q-num">${c+1}.</span> <span class="q-body">${re(i.bodyText||"")}</span></p>`,i.headerText&&i.headerText.trim()&&(n+=`<div class="q-header">${re(i.headerText)}</div>`),n+='<div class="options">',["A","B","C","D"].forEach(d=>{var p;const g=((p=i.options)==null?void 0:p[d])||"";if(!g)return;const l=o&&i.correctOption===d;n+=`<div class="option ${l?"correct":""}">${d}.&nbsp;${re(g)}</div>`}),n+="</div>",o&&i.correctOption&&(n+=`<div class="correct-badge">✔ Respuesta: ${i.correctOption}</div>`),n+="</div>"}),o){n+='<div class="answer-table-section"><h2>TABLA DE RESPUESTAS</h2>',n+='<table class="claves"><thead><tr><th>N°</th><th>Respuesta</th><th>N°</th><th>Respuesta</th><th>N°</th><th>Respuesta</th></tr></thead><tbody>';const i=Math.ceil(t.length/3);for(let c=0;c<i;c++){n+="<tr>";for(let d=0;d<3;d++){const g=c+d*i;g<t.length?n+=`<td>${g+1}</td><td class="ans-cell">${t[g].correctOption||"—"}</td>`:n+="<td></td><td></td>"}n+="</tr>"}n+="</tbody></table></div>"}n+=`<div class="footer">ICFES Extractor — ${a} — ${r}</div>`,n+="</body></html>";const s=window.open("","_blank","width=900,height=750");s.document.write(n),s.document.close(),s.onload=()=>s.print()}function Je(t,e){const o=URL.createObjectURL(t),a=document.createElement("a");a.href=o,a.download=e,document.body.appendChild(a),a.click(),document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(o),5e3)}function Ie(){const t=new Date;return`${t.getFullYear()}${String(t.getMonth()+1).padStart(2,"0")}${String(t.getDate()).padStart(2,"0")}`}function re(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\n/g,"<br>")}const ie={dashboard:document.getElementById("view-dashboard"),upload:document.getElementById("view-upload"),browser:document.getElementById("view-area-browser")},Q={dashboard:document.getElementById("nav-dashboard"),upload:document.getElementById("nav-upload")},ge=document.getElementById("page-title-text"),D=document.getElementById("upload-dropzone"),me=document.getElementById("file-input"),Le=document.getElementById("selected-file-info"),qe=document.getElementById("file-info-name"),et=document.getElementById("btn-clear-file"),Ae=document.getElementById("select-upload-area"),G=document.getElementById("btn-process-file"),ee=document.getElementById("upload-progress-container"),M=document.getElementById("progress-status-text"),fe=document.getElementById("progress-bar-fill"),he=document.getElementById("progress-percentage"),te=document.getElementById("extraction-results-wrapper"),be=document.getElementById("extracted-count-summary"),ce=document.getElementById("extracted-questions-list"),U=document.getElementById("btn-save-all-extracted");document.getElementById("browser-area-title");const $e=document.getElementById("browser-area-count-summary"),de=document.getElementById("saved-questions-list"),tt=document.getElementById("btn-back-to-dashboard"),xe=document.getElementById("btn-generate-text-area"),nt=document.getElementById("btn-generate-text-all"),Te=document.getElementById("text-modal"),ot=document.getElementById("modal-title"),J=document.getElementById("generated-text-box"),at=document.getElementById("btn-close-modal"),st=document.getElementById("btn-close-modal-ok"),q=document.getElementById("btn-copy-text"),j=document.getElementById("evaluacion-modal"),we=document.getElementById("btn-generar-evaluacion"),rt=document.getElementById("btn-close-eval-modal"),ye=document.getElementById("eval-select-area"),it=document.getElementById("eval-num-preguntas"),ct=document.getElementById("eval-incluir-claves"),Z=document.getElementById("eval-warning-text"),le=document.getElementById("btn-eval-word"),pe=document.getElementById("btn-eval-excel"),ue=document.getElementById("btn-eval-pdf");let Be="dashboard",N="",_=null,v=[];const O={matematicas:"Matemáticas",lectura_critica:"Lectura Crítica",sociales_ciudadanas:"Sociales y Ciudadanas",ciencias_naturales:"Ciencias Naturales",ingles:"Inglés"};async function dt(){await W(),lt(),await ve()}function lt(){Object.keys(Q).forEach(e=>{Q[e].addEventListener("click",()=>H(e))}),document.querySelectorAll(".area-card").forEach(e=>{e.addEventListener("click",()=>{const o=e.getAttribute("data-area");pt(o)})}),D.addEventListener("click",()=>me.click()),me.addEventListener("change",ut),D.addEventListener("dragover",e=>{e.preventDefault(),D.classList.add("dragover")}),D.addEventListener("dragleave",()=>{D.classList.remove("dragover")}),D.addEventListener("drop",e=>{e.preventDefault(),D.classList.remove("dragover"),e.dataTransfer.files.length>0&&Se(e.dataTransfer.files[0])}),et.addEventListener("click",De),G.addEventListener("click",gt),U.addEventListener("click",mt),tt.addEventListener("click",()=>H("dashboard")),at.addEventListener("click",Ee),st.addEventListener("click",Ee),q.addEventListener("click",ft),xe.addEventListener("click",()=>ht(N)),nt.addEventListener("click",()=>bt()),we.addEventListener("click",()=>{j.classList.add("active"),Z.style.display="none"}),rt.addEventListener("click",()=>j.classList.remove("active")),j.addEventListener("click",e=>{e.target===j&&j.classList.remove("active")}),we.addEventListener("click",()=>{Be==="browser"&&N&&(ye.value=N)});async function t(e){const o=ye.value,a=parseInt(it.value,10)||30,r=ct.checked;[le,pe,ue].forEach(n=>n.setAttribute("disabled","true")),Z.style.display="none";try{const{questions:n,warning:s}=await Ve(o,a);if(s&&(Z.textContent=s,Z.style.display="block"),e==="word"){if(!window.docx)throw new Error("La librería docx no está cargada. Verifica tu conexión a internet.");await Ke(n,o,r)}else if(e==="excel"){if(!window.XLSX)throw new Error("La librería XLSX no está cargada. Verifica tu conexión a internet.");Ye(n,o,r)}else e==="pdf"&&Ze(n,o,r)}catch(n){alert(`Error al generar la evaluación: ${n.message}`)}finally{[le,pe,ue].forEach(n=>n.removeAttribute("disabled"))}}le.addEventListener("click",()=>t("word")),pe.addEventListener("click",()=>t("excel")),ue.addEventListener("click",()=>t("pdf"))}function H(t){Be=t,Object.keys(Q).forEach(e=>{e===t?Q[e].classList.add("active"):Q[e].classList.remove("active")}),Object.keys(ie).forEach(e=>{e===t?ie[e].classList.remove("hidden"):ie[e].classList.add("hidden")}),t==="dashboard"?(ge.textContent="Dashboard de Áreas",ve()):t==="upload"&&(ge.textContent="Carga y Extracción")}async function ve(){for(const t of Object.keys(O)){const e=await z(t),o=document.getElementById(`count-${t}`);o&&(o.textContent=e.length)}}async function pt(t){N=t,ge.textContent=`Banco de Preguntas > ${O[t]}`,await Oe(),H("browser")}function Se(t){const e=t.name.split(".").pop().toLowerCase();if(e!=="pdf"&&e!=="docx"){alert("Por favor, selecciona un archivo válido (.pdf o .docx)");return}_=t,qe.textContent=`${t.name} (${(t.size/1024/1024).toFixed(2)} MB)`,Le.classList.add("visible"),G.removeAttribute("disabled"),ee.classList.remove("visible"),fe.style.width="0%",he.textContent="0%",te.classList.add("hidden"),v=[]}function De(){_=null,me.value="",Le.classList.remove("visible"),G.setAttribute("disabled","true"),ee.classList.remove("visible"),te.classList.add("hidden"),v=[]}function ut(t){t.target.files.length>0&&Se(t.target.files[0])}async function gt(){if(!_)return;const t=Ae.value;ee.classList.add("visible"),fe.style.width="10%",he.textContent="10%",M.textContent="Leyendo archivo...",G.setAttribute("disabled","true");try{const e=await _.arrayBuffer(),o=_.name.split(".").pop().toLowerCase();let a=[];const r=n=>{fe.style.width=`${n}%`,he.textContent=`${n}%`,n<50?M.textContent="Extrayendo texto del documento...":n<80?M.textContent="Filtrando y procesando preguntas...":n<100?M.textContent="Estructurando preguntas e imágenes...":M.textContent="¡Extracción completada!"};o==="pdf"?a=await Ge(e,r):a=await We(e,r),v=a.map((n,s)=>({...n,area:t,tempId:s})),_e()}catch(e){console.error("Error al procesar el archivo:",e),alert(`Error de procesamiento: ${e.message}`),ee.classList.remove("visible")}finally{G.removeAttribute("disabled")}}function _e(){if(ce.innerHTML="",v.length===0){be.textContent="No se detectaron preguntas individuales válidas (o se descartaron por ser de múltiples preguntas).",ce.innerHTML='<div class="empty-state">No se extrajeron preguntas. Intenta con otro archivo.</div>',te.classList.remove("hidden");return}be.textContent=`Se detectaron ${v.length} preguntas individuales listas para guardar.`,v.forEach(t=>{const e=document.createElement("div");e.className="question-item",e.id=`extracted-card-${t.tempId}`;const o=["A","B","C","D"];let a="";o.forEach(n=>{a+=`
        <div class="option-input-group">
          <span class="option-letter">${n}</span>
          <input type="text" class="option-text-field" data-q-temp-id="${t.tempId}" data-opt="${n}" value="${t.options[n]}">
        </div>
      `});let r="";t.images&&t.images.length>0&&(r='<div class="question-images">',t.images.forEach((n,s)=>{r+=`
          <div class="extracted-img-container" id="extracted-img-${t.tempId}-${s}">
            <img src="${n}" alt="Pregunta ${t.number}">
            <button class="remove-img-btn" onclick="window.removeExtractedImage(${t.tempId}, ${s})">×</button>
          </div>
        `}),r+="</div>"),e.innerHTML=`
      <div class="question-meta">
        <span>Pregunta original: #${t.number}</span>
        <span>Área: ${O[t.area]}</span>
      </div>
      
      <div style="margin-bottom: 8px;">
        <label class="form-label">Contexto / Encabezado (Opcional)</label>
        <textarea class="question-text-edit" style="height: 60px;" data-q-temp-id="${t.tempId}" data-field="headerText" placeholder="Texto introductorio de referencia exclusivo de esta pregunta">${t.headerText||""}</textarea>
      </div>

      <div style="margin-bottom: 12px;">
        <label class="form-label">Enunciado de la Pregunta</label>
        <textarea class="question-text-edit" style="height: 100px;" data-q-temp-id="${t.tempId}" data-field="bodyText" required>${t.bodyText}</textarea>
      </div>

      ${r}

      <label class="form-label">Opciones de Respuesta</label>
      <div class="question-options-grid">
        ${a}
      </div>

      <div class="question-action-bar">
        <div class="correct-select">
          <span class="form-label" style="margin-bottom: 0;">Clave de Respuesta:</span>
          <select class="select-control" style="width: 80px; padding: 4px 8px;" data-q-temp-id="${t.tempId}" data-field="correctOption">
            <option value="">Ninguna</option>
            <option value="A" ${t.correctOption==="A"?"selected":""}>A</option>
            <option value="B" ${t.correctOption==="B"?"selected":""}>B</option>
            <option value="C" ${t.correctOption==="C"?"selected":""}>C</option>
            <option value="D" ${t.correctOption==="D"?"selected":""}>D</option>
          </select>
        </div>

        <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="window.removeExtractedQuestion(${t.tempId})">
          Descartar
        </button>
      </div>
    `,ce.appendChild(e)}),document.querySelectorAll("[data-q-temp-id]").forEach(t=>{t.addEventListener("input",e=>{const o=parseInt(e.target.getAttribute("data-q-temp-id"),10),a=e.target.getAttribute("data-field"),r=e.target.getAttribute("data-opt"),n=v.find(s=>s.tempId===o);n&&(r?n.options[r]=e.target.value:a&&(n[a]=e.target.value))}),t.addEventListener("change",e=>{const o=parseInt(e.target.getAttribute("data-q-temp-id"),10);if(e.target.getAttribute("data-field")==="correctOption"){const r=v.find(n=>n.tempId===o);r&&(r.correctOption=e.target.value)}})}),te.classList.remove("hidden")}window.removeExtractedImage=function(t,e){const o=v.find(a=>a.tempId===t);if(o&&o.images){o.images.splice(e,1);const a=document.getElementById(`extracted-img-${t}-${e}`);a&&a.remove()}};window.removeExtractedQuestion=function(t){v=v.filter(o=>o.tempId!==t);const e=document.getElementById(`extracted-card-${t}`);e&&e.remove(),be.textContent=`Se detectaron ${v.length} preguntas individuales listas para guardar.`,v.length===0&&_e()};async function mt(){if(v.length!==0){U.setAttribute("disabled","true"),U.textContent="Guardando...";try{const t=await ke({name:_.name,size:_.size,area:Ae.value,questionCount:v.length});for(const e of v)await Me({fileId:t,area:e.area,headerText:e.headerText,bodyText:e.bodyText,options:e.options,correctOption:e.correctOption,images:e.images});alert("¡Preguntas guardadas con éxito en la base de datos!"),De(),H("dashboard")}catch(t){console.error("Error al guardar preguntas:",t),alert("Hubo un error al guardar en la base de datos local.")}finally{U.removeAttribute("disabled"),U.textContent="Guardar Seleccionadas a la BBDD"}}}async function Oe(){de.innerHTML="";const t=await z(N);if($e.textContent=`${t.length} preguntas guardadas en esta categoría.`,t.length===0){de.innerHTML=`
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        <p>Aún no hay preguntas guardadas en esta categoría.</p>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="window.goToUploadView()">Subir archivo</button>
      </div>
    `,xe.setAttribute("disabled","true");return}xe.removeAttribute("disabled"),t.forEach(e=>{const o=document.createElement("div");o.className="saved-q-card",o.id=`saved-card-${e.id}`;let a="";e.images&&e.images.length>0&&(a='<div class="question-images">',e.images.forEach(r=>{a+=`
          <div class="extracted-img-container">
            <img src="${r}" alt="Imagen de pregunta">
          </div>
        `}),a+="</div>"),o.innerHTML=`
      <div class="question-meta">
        <span>ID #${e.id}</span>
        <span>Fecha de creación: ${new Date(e.createdAt).toLocaleDateString()}</span>
      </div>

      ${e.headerText?`<div style="font-weight: 500; font-style: italic; opacity: 0.85; margin-bottom: 8px; border-left: 2px solid var(--primary); padding-left: 8px;">${e.headerText}</div>`:""}
      
      <div class="saved-q-body">${e.bodyText}</div>

      ${a}

      <div class="saved-q-options">
        <div class="saved-q-option ${e.correctOption==="A"?"correct":""}"><strong>A.</strong> ${e.options.A}</div>
        <div class="saved-q-option ${e.correctOption==="B"?"correct":""}"><strong>B.</strong> ${e.options.B}</div>
        <div class="saved-q-option ${e.correctOption==="C"?"correct":""}"><strong>C.</strong> ${e.options.C}</div>
        <div class="saved-q-option ${e.correctOption==="D"?"correct":""}"><strong>D.</strong> ${e.options.D}</div>
      </div>

      <div class="question-action-bar" style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
        <span style="font-size: 13px; color: var(--accent); font-weight: 600;">
          ${e.correctOption?`Respuesta Correcta: ${e.correctOption}`:"Sin clave especificada"}
        </span>
        <button class="btn btn-danger" style="padding: 4px 8px; font-size: 11px;" onclick="window.deleteSavedQuestion(${e.id})">
          Eliminar
        </button>
      </div>
    `,de.appendChild(o)})}window.goToUploadView=function(){H("upload")};window.deleteSavedQuestion=async function(t){if(confirm("¿Estás seguro de que deseas eliminar esta pregunta del banco?")){await je(t);const e=document.getElementById(`saved-card-${t}`);e&&e.remove(),await ve();const o=await z(N);$e.textContent=`${o.length} preguntas guardadas en esta categoría.`,o.length===0&&Oe()}};function Pe(t,e){let o=`==================================================
`;return o+=`PREGUNTAS EXTRAÍDAS: ${e.toUpperCase()}
`,o+=`==================================================

`,t.length===0?(o+=`No hay preguntas registradas.
`,o):(t.forEach((a,r)=>{o+=`PREGUNTA ${r+1}.
`,a.headerText&&(o+=`${a.headerText}

`),o+=`${a.bodyText}

`;const n=s=>{const i=a.options[s]||"";return a.correctOption===s?`**${s}. ${i}** (Correcta)`:`${s}. ${i}`};o+=`${n("A")}
`,o+=`${n("B")}
`,o+=`${n("C")}
`,o+=`${n("D")}

`,a.correctOption&&(o+=`Solución correcta: Opción ${a.correctOption}
`),a.images&&a.images.length>0&&(o+=`[Imágenes asociadas: ${a.images.length}]
`),o+=`--------------------------------------------------

`}),o)}function Fe(t,e){ot.textContent=t,J.value=e,Te.classList.add("active")}function Ee(){Te.classList.remove("active")}function ft(){J.select(),J.setSelectionRange(0,99999),navigator.clipboard.writeText(J.value);const t=q.textContent;q.textContent="¡Copiado!",setTimeout(()=>{q.textContent=t},2e3)}async function ht(t){const e=await z(t),o=Pe(e,O[t]);Fe(`Preguntas de ${O[t]}`,o)}async function bt(){let t="";for(const e of Object.keys(O)){const o=await z(e);o.length>0&&(t+=Pe(o,O[e])+`

`)}t||(t="La base de datos está vacía. Sube y extrae preguntas primero."),Fe("Banco Completo de Preguntas ICFES",t)}window.addEventListener("DOMContentLoaded",dt);
