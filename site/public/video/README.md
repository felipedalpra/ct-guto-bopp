# Vídeo da capa

Coloque o arquivo aqui com estes nomes exatos — o site já aponta para eles:

| Arquivo | Papel |
|---|---|
| `hero.mp4` | obrigatório (H.264, compatível com todo navegador) |
| `hero.webm` | opcional, mas recomendado (VP9/AV1, arquivo bem menor) |

Enquanto os arquivos não existirem, a capa mostra o fundo próprio dela
(gradiente + marcação de quadra) — o site não quebra.

## Como preparar o arquivo

O vídeo é decorativo, roda **mudo e em loop**, e é a primeira coisa que carrega.
Mire em **até 4 MB** e **10–20 segundos** de loop limpo.

```bash
# 1080p, sem áudio, otimizado para começar a tocar cedo
ffmpeg -i original.mov -t 18 -an -vf "scale=-2:1080" \
  -c:v libx264 -crf 26 -preset slow -movflags +faststart hero.mp4

# versão webm (bem menor, servida antes do mp4 quando o navegador aceita)
ffmpeg -i original.mov -t 18 -an -vf "scale=-2:1080" \
  -c:v libvpx-vp9 -crf 36 -b:v 0 hero.webm
```

## O que funciona bem nessa capa

- Plano **horizontal**, movimento lento, sem corte brusco — o texto fica por cima.
- Ação reconhecível de Beach Tennis: saque, deslocamento na areia, bola no ar.
- Evite vídeo com legenda ou logo embutidos: a capa já tem os dois.

O `poster` (primeiro quadro exibido) está definido em `src/components/Hero.tsx` e
aponta para `public/img/capa-poster.jpg` — hoje é o primeiro quadro do próprio
`hero.mp4`, para a capa não piscar outra imagem antes do vídeo entrar. Se trocar o
vídeo, gere o poster de novo a partir do mesmo quadro inicial.

Vídeo atual: `Videoscapa/materiais/WhatsApp Video 2026-08-27 at 09.27.15.mp4`
— Guto conduzindo a turma, câmera parada, 17s mudos a partir de 0:02.

Foi escolhido entre os cinco materiais horizontais enviados porque é o único com
câmera estável, ação contínua do começo ao fim e sem faixa de patrocinador legível
atravessando o quadro (os outros trazem `#VEMPRAPLAY` / `IMPROPLAY` em destaque, um
tem só 5s e um é vertical).

Como foi gerado (corte de cor + loop sem emenda, ambos no comando):

```bash
GRADE="crop=964:542:60:34,hqdn3d=3:2:6:6,scale=1280:720:flags=lanczos,\
eq=contrast=1.14:brightness=-0.02:saturation=1.06:gamma=0.98,\
colorbalance=rs=-0.05:gs=-0.02:bs=0.10:rm=0.03:gm=0.01:bm=-0.02:rh=0.05:gh=0.03:bh=-0.03,\
unsharp=5:5:0.6,vignette=PI/5,fps=30,format=yuv420p"

# o split/xfade abaixo cruza o fim com o começo: o loop não dá salto visível
FC="[0:v]trim=2:20,setpts=PTS-STARTPTS,${GRADE},split=3[a][b][c];\
[a]trim=1:17,setpts=PTS-STARTPTS[main];[b]trim=17:18,setpts=PTS-STARTPTS[tail];\
[c]trim=0:1,setpts=PTS-STARTPTS[head];[tail][head]xfade=transition=fade:duration=1:offset=0[seam];\
[main][seam]concat=n=2:v=1:a=0[out]"

ffmpeg -i original.mp4 -filter_complex "$FC" -map "[out]" -an \
  -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart hero.mp4
ffmpeg -i original.mp4 -filter_complex "$FC" -map "[out]" -an \
  -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 hero.webm
ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 ../img/capa-poster.jpg
```

O que cada parte do corte de cor resolve, já que o material sai do celular achatado
e frio: `crop` tira a coluna escura da esquerda e a sobra de telhado; `hqdn3d` limpa
o ruído (e derruba o tamanho do arquivo); `eq` + `colorbalance` puxam sombra para o
azul da marca e a areia para o quente; `vignette` fecha as bordas para o texto da
capa ganhar contraste sem precisar de mais véu por cima.
