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

O `poster` (primeiro quadro exibido) está definido em `src/components/Hero.tsx`.
Assim que houver uma foto horizontal em alta, troque-o por ela.
