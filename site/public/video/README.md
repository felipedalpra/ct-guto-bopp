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

Vídeo atual: `Videoscapa/material_novo/usar.MOV` — 4K 60fps, de trás da quadra:
Guto na rede alimentando bola, turma no treino de deslocamento. Janela de 2s a 15s
do original, loop de 12s.

Escolhido pela qualidade de origem (4K contra os 720p do material anterior de
WhatsApp). Traz uma faixa rosa de patrocinador (`#VEMPROPLAY`) presa à rede, do
lado direito do Guto — não sai do quadro sem cortar o Guto junto; o corte de cor
e a vinheta a deixam menos evidente, e o zoom + véu da capa cobrem o resto.

Como foi gerado (corte de cor + loop sem emenda, ambos no comando):

```bash
GRADE="crop=2550:1435:400:220,hqdn3d=3:2:6:6,scale=1280:720:flags=lanczos,\
eq=contrast=1.06:brightness=0.012:saturation=1.04:gamma=1.02,\
colorbalance=rs=-0.03:gs=-0.01:bs=0.07:rm=0.02:bm=-0.02:rh=0.03:gh=0.01:bh=-0.03,\
unsharp=5:5:0.4,vignette=PI/5,fps=30,format=yuv420p"

# o split/xfade abaixo cruza o fim com o começo: o loop não dá salto visível
FC="[0:v]trim=2:15,setpts=PTS-STARTPTS,${GRADE},split=3[a][b][c];\
[a]trim=1:12,setpts=PTS-STARTPTS[main];[b]trim=12:13,setpts=PTS-STARTPTS[tail];\
[c]trim=0:1,setpts=PTS-STARTPTS[head];[tail][head]xfade=transition=fade:duration=1:offset=0[seam];\
[main][seam]concat=n=2:v=1:a=0[out]"

ffmpeg -i usar.MOV -filter_complex "$FC" -map "[out]" -an \
  -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart hero.mp4
ffmpeg -i usar.MOV -filter_complex "$FC" -map "[out]" -an \
  -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 -tile-columns 2 -threads 4 \
  -deadline good -cpu-used 3 hero.webm
ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 ../img/capa-poster.jpg
```

O que cada parte do corte de cor resolve, já que o material sai do celular achatado
e frio: `crop` fecha o quadro (menos telhado, menos rodapé, empurra a faixa rosa e
o aluno parado da direita para fora); `hqdn3d` limpa o ruído (e derruba o tamanho
do arquivo); `eq` + `colorbalance` abrem um pouco a luz, puxam a sombra para o navy
da marca e a areia para o quente; `vignette` fecha as bordas para o texto da capa
ganhar contraste sem precisar de mais véu por cima.
