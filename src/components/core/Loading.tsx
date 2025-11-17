import Backdrop from '@mui/material/Backdrop';
import Image from 'next/image';
import styles from './Loading.module.css';

interface LoadingProps {
  open: boolean;
}

const Loading = ({ open }: LoadingProps) => {
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div
          className="w-100 h-100 bg-white rounded-12 p-20"
          style={{ boxShadow: '0px 4px 16px 0px #292B301A' }}
        >
          <Image
            className={styles.loader}
            src="/images/ic_loading.svg"
            alt="loader"
            width={60}
            height={60}
          />
        </div>
      </Backdrop>
    </div>
  );
};

const PageLoading = () => {
  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight: 600 }}
    >
      <div
        className="w-100 h-100 bg-white rounded-12 p-20"
        style={{ boxShadow: '0px 4px 16px 0px #292B301A' }}
      >
        <Image
          className={styles.loader}
          src="/images/ic_loading.svg"
          alt="loader"
          width={60}
          height={60}
        />
      </div>
    </div>
  );
};

export { Loading, PageLoading };
