<script>
export default {
  name: 'HighlightText',
  props: ['text', 'highlightText'],
  methods: {
    genHighlight() {
      if (!this.highlightText) {
        return <span>{this.text}</span>
      }
      const titleToMatch = this.text.toLowerCase()
      const keyword = this.highlightText.toLowerCase()
      const matchIndex = titleToMatch.indexOf(keyword)
      const beforeStr = this.text.substr(0, matchIndex)
      const afterStr = this.text.substr(matchIndex + keyword.length)
      const hitStr = this.text.substr(matchIndex, keyword.length)
      const titleSpan = matchIndex > -1 ? (
        <span>{beforeStr}<span class='high-light-text'>{hitStr}</span>{afterStr}</span>
      ) : (this.text)

      return <span>{titleSpan}</span>
    }
  },
  render() {
    return this.genHighlight()
  }
}
</script>

<style lang="scss" scoped>
.high-light-text {
  color: $blue;
}
</style>
