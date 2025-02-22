import { getCalApi } from '@calcom/embed-react';
import React, { useEffect } from 'react';

const BookACall = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: '30min' });
      cal('ui', {
        cssVarsPerTheme: { light: { 'cal-brand': '#0693e3' }, dark: { 'cal-brand': '#f4f4f4' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <button
      data-cal-namespace="30min"
      data-cal-link="sidmirza4/30min"
      data-cal-config='{"layout":"month_view"}'
      type="button"
      className="email-link"
    >
      Book a Call
    </button>
  );
};

export default BookACall;
