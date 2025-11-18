export function useFieldArrayRemove(
  removeFunction,
  index,
  confStringIdx,
  type,
  typeIdx
) {
  console.log(`useFieldArrayRemove : ` + index, confStringIdx, type, typeIdx);

  // 0은 통과해야함
  if (typeIdx === null || typeIdx === undefined || typeIdx === '') {
    removeFunction(index);
    return;
  } else {
    Swal.fire({
      icon: 'warning',
      title: '정말로 삭제하시겠습니까? ',
      text: '삭제할경우 DB에서도 삭제되며 다시 되돌릴 수 없습니다.',
      confirmButtonText: 'OK',
      showDenyButton: true,
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {
        adminApi
          .removeTypeFromDB(confStringIdx, type, typeIdx)
          .then((result) => {
            removeFunction(index);
            Swal.fire({
              icon: 'success',
              text: result.data.message,
            });
          })
          .catch((result) => {
            console.log(result);
            Swal.fire({
              icon: 'error',
              text: result.response
                ? result.response.data.message
                : '현재 서버에 문제가 있습니다. 관리자에게 문의해주세요.',
            });
          });
      }
    });
  }
}
