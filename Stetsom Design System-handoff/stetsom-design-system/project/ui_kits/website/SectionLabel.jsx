// SectionLabel.jsx — Red line + ALL CAPS label pattern

Object.assign(window, {
  SectionLabel: function SectionLabel({ label, title, subtitle, dark }) {
    const textColor = dark ? '#fff' : 'rgb(18,18,18)';
    const subColor = dark ? 'rgb(184,184,184)' : 'rgb(102,102,102)';
    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('div', { style: { width: 24, height: 1, background: 'rgb(232,19,42)', flexShrink: 0 } }),
        React.createElement('span', {
          style: {
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 500, fontSize: 16,
            textTransform: 'uppercase', color: 'rgb(232,19,42)', lineHeight: 1,
          }
        }, label)
      ),
      title && React.createElement('div', {
        style: {
          fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 40,
          textTransform: 'uppercase', color: textColor, lineHeight: 1, marginTop: 2,
        }
      }, title),
      subtitle && React.createElement('p', {
        style: {
          fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 16,
          color: subColor, marginTop: 4, lineHeight: 1.5,
        }
      }, subtitle)
    );
  }
});
