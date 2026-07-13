import React from 'react';
import {Text} from 'react-native';

// brain/explanations.js returns plain strings with <b>...</b> markers for
// emphasis. React Native can't render raw HTML, so this splits on <b> tags
// and renders the bold segments as nested <Text style={boldStyle}>.
export default function RichText({text, style, boldStyle}) {
  const parts = text.split(/<b>|<\/b>/);
  return (
    <Text style={style}>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <Text key={i} style={boldStyle}>{part}</Text>
          : part,
      )}
    </Text>
  );
}
