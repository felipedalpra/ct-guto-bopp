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
Mire em **até 2 MB** e **10–20 segundos** de loop limpo.

## O que funciona bem nessa capa

- Plano **horizontal**, movimento lento, sem corte brusco — o texto fica por cima.
- Ação reconhecível de Beach Tennis: saque, deslocamento na areia, bola no ar.
- Evite vídeo com legenda ou logo embutidos: a capa já tem os dois.
- **Sem vinheta no encode.** O véu do CSS já fecha as bordas; vinheta dobrada
  escurece a quadra inteira. Essa lição já custou um retrabalho.

O `poster` (primeiro quadro exibido) está definido em `src/components/Hero.tsx` e
aponta para `public/img/capa-poster.jpg` — hoje é o primeiro quadro do próprio
`hero.mp4`, para a capa não piscar outra imagem antes do vídeo entrar. Se trocar o
vídeo, gere o poster de novo a partir do mesmo quadro inicial.

## Vídeo atual

Banco de imagem: [Net to Beach Volleyball](https://www.pexels.com/video/net-to-beach-volleyball-13373994/),
de Fábio Reis de Abreu (Pexels — licença livre, uso comercial, sem atribuição
obrigatória). Bruto guardado em `Videoscapa/pexels-13373994-rede-contraluz.mp4`
(fora do versionamento). 1920×1080 60fps, 33s, câmera fixa: rede de praia em
contraluz no fim de tarde, silhueta caminhando ao fundo.

Entrou no lugar do material do cliente porque as cinco gravações enviadas são de
WhatsApp (já recomprimidas, 1024×576, achatadas e frias) e nenhum tratamento
levantava aquilo para um fundo de capa em tela cheia.

Foi escolhido entre três candidatos de banco, todos baixados e conferidos quadro
a quadro — descrição de banco engana, frame não:

- **[38903486](https://www.pexels.com/video/beach-volleyball-net-with-ocean-background-38903486/)**
  (close da rede): rede frouxa e esburacada, céu estourado no terço superior.
  Lê como quadra abandonada — o oposto de "Disciplina. Método. Resultado."
- **[6770640](https://www.pexels.com/video/wide-angle-shot-of-men-playing-beach-tennis-6770640/)**
  (beach tennis de verdade): dia cinza chapado, jogadores minúsculos ao longe e
  uma bicicleta encostada no poste no centro do quadro.

O ponto fraco do escolhido, assumido: **a quadra está vazia**. Ganha em imagem e
perde em energia — não mostra treino acontecendo. A troca definitiva é uma
regravação do CT: tripé, 4K, fim de tarde (17h–18h), enviada por Drive e **não
por WhatsApp**, que é o que destrói o material na origem.

Como foi gerado (corte de cor + loop sem emenda, ambos no comando):

```bash
GRADE="crop=1500:844:0:200,scale=1440:810:flags=lanczos,\
eq=contrast=1.12:saturation=1.14:gamma=0.97,\
colorbalance=rs=-0.04:gs=-0.01:bs=0.08:rh=0.06:gh=0.03:bh=-0.04,\
unsharp=5:5:0.4,fps=30,format=yuv420p"

# o split/xfade abaixo cruza o fim com o começo: o loop não dá salto visível
FC="[0:v]trim=4:23,setpts=PTS-STARTPTS,${GRADE},split=3[a][b][c];\
[a]trim=1:17,setpts=PTS-STARTPTS[main];[b]trim=17:18,setpts=PTS-STARTPTS[tail];\
[c]trim=0:1,setpts=PTS-STARTPTS[head];[tail][head]xfade=transition=fade:duration=1:offset=0[seam];\
[main][seam]concat=n=2:v=1:a=0[out]"

ffmpeg -i original.mp4 -filter_complex "$FC" -map "[out]" -an \
  -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart hero.mp4
ffmpeg -i original.mp4 -filter_complex "$FC" -map "[out]" -an \
  -c:v libvpx-vp9 -crf 37 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 hero.webm
ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 ../img/capa-poster.jpg
```

O que cada parte resolve: `crop` fecha o enquadramento na rede e **tira o skyline
de cidade da borda direita**, que denunciaria outra praia; `eq` + `colorbalance`
puxam a sombra para o azul da marca e a areia para o quente; `unsharp` devolve
definição perdida no reescalonamento. Sem `hqdn3d` desta vez — a fonte é limpa, e
o denoise só apagaria a textura da areia.
