export const taxInvoiceStatus = {
    요청없음 : 'none',
    대기 : 'pending',
    완료 :'completed'
  } as const;


export const recipientMethod = {
    front_door :    '문앞',
    security_office: '경비실',
    parcel_box: '택배함',
    direct_receive: '직접 수령'
} as const;