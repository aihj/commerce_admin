import Swal, { SweetAlertIcon } from 'sweetalert2';

interface AlertProps {
  icon?: SweetAlertIcon;
  iconHtml?: string;
  title: string;
  text?: string;
  html?: string;
  confirmButtonText?: string;
  confirmButtonBg?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  cancelButtonBg?: string;
}

const Alert = ({
  icon = undefined,
  iconHtml,
  title,
  text,
  html,
  confirmButtonText = '확인',
  confirmButtonBg = 'var(--color-secondary-darkest)',
  showCancelButton = false,
  cancelButtonText = '취소',
  cancelButtonBg = '#C4C7CB',
}: AlertProps) =>
  Swal.fire({
    icon: icon,
    iconHtml: iconHtml,
    title: title,
    text: text,
    html,
    focusConfirm: false,
    focusCancel: false,
    reverseButtons: true,
    width: 540,
    padding: '40px 24px 24px',
    confirmButtonText: confirmButtonText,
    confirmButtonColor: confirmButtonBg,
    showCancelButton: showCancelButton,
    cancelButtonText: cancelButtonText,
    cancelButtonColor: cancelButtonBg,
    customClass: {
      container: '!z-2000',
      popup: '!rounded-12',
      htmlContainer:
        '!text-gray-900 !text-18 !pt-20 !pb-40 !px-0 !m-0 !leading-28',
      title: 'text-black font-bold text-24 !p-0',
      confirmButton: `!text-18 focus:!shadow-none ${showCancelButton ? 'w-1/2' : 'w-full'} !rounded-10 h-52 font-bold`,
      cancelButton:
        '!text-18 focus:!shadow-none w-1/2 !rounded-10 h-52 font-bold',
      actions: 'w-full flex-nowrap !m-0',
      icon: 'border-0 w-80 h-80 my-0 mb-20',
    },
  });

export { Alert };
