export const getTextNodes = (node: Element): Element[] => {
  return node.nodeType === Node.TEXT_NODE
    ? [node]
    : // @ts-ignore
      [...node.childNodes].flatMap(getTextNodes)
}

export const atPos = (
  pos: number,
  elem: Element
): { node: Element | null; offset: number } => {
  if (elem.nodeType === Node.TEXT_NODE) {
    const length = elem.textContent.length
    if (pos <= length) console.log('found in', elem.textContent, pos)
    else console.log('not found in', elem.textContent)
    return pos <= length
      ? {
          node: elem,
          offset: pos,
        }
      : { node: null, offset: length !== Infinity ? length : 0 }
  }

  const textChildren = getTextNodes(elem)

  // @ts-ignore
  for (const child of textChildren) {
    const { node, offset } = atPos(pos, child)
    console.log({ node, offset })
    if (node) return { node, offset }
    pos -= offset
  }

  return {
    node: null,
    offset: Infinity,
  }
}
