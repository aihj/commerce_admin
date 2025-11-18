import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouterLink from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Control, Controller } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  Select,
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { logger } from '@/lib/logger/defaultLogger';
import { getLocations } from '@/api/conferenceApi';
import { PATH } from '@/paths';

type ProgramLocationSelectTypes = {
  control: Control;
  filedName: string;
  index?: number;
  // item?: any;
  requiredMessage: false | string; // ""일 경우는 필수 속성이 아님
  errors: any;
};

export default function ProgramLocationSelect({
  control,
  filedName,
  index,
  // item,
  requiredMessage,
  errors,
}: ProgramLocationSelectTypes) {
  const { confStringIdx } = useParams();
  // region ****************************** 데이터 가져오기 ******************************
  const {
    isLoading,
    error,
    data: locationData,
  } = useQuery({
    queryKey: ['locations', confStringIdx],
    queryFn: () => getLocations(confStringIdx).then((res) => res.data),
    enabled: !!confStringIdx,
  });

  // **************** Select 옵션 생성하기 ****************
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (!!locationData && locationData !== [] && options.length === 0) {
      setOptions(generateOptions(locationData));
    }
  }, [locationData, options.length]);

  const generateOptions = (data) => {
    return data.map((item) => {
      const { locationIdx, locationName, locationAddr } = item;
      const label = `${locationName} (${locationAddr || '-'})`;
      return { value: locationIdx, label };
    });
  };
  logger.debug('<ProgramLocationSelectTypes> options : ', options);
  // endregion ****************************** 데이터 가져오기 ***************************

  // ******************************************
  if (isLoading) return null;
  if (error)
    return (
      <>
        <InputLabel required={requiredMessage}>장소</InputLabel>
        <FormHelperText>
          등록된 장소가 없어 선택하실 수 없습니다.
        </FormHelperText>
      </>
    );
  if (!locationData) {
    return (
      <>
        <InputLabel required={requiredMessage}>장소</InputLabel>
        <FormHelperText>
          등록된 장소가 없어 선택하실 수 없습니다.
          <Link
            color="primary"
            component={RouterLink}
            href={PATH.EACH.CONFERENCE.DETAIL(confStringIdx)}
            sx={{ marginLeft: '10px' }}
            variant="outlined"
          >
            장소 등록하러 가기
          </Link>
        </FormHelperText>
      </>
    );
  }
  return (
    <Grid md={6} xs={12}>
      <Controller
        control={control}
        name={
          index !== null
            ? `${filedName}.${index}.locationIdx`
            : `${filedName}.locationIdx`
        }
        rules={{ required: requiredMessage }}
        render={({ field }) => (
          <FormControl
            error={Boolean(errors.billingAddress?.country)}
            fullWidth
          >
            <InputLabel required={!!requiredMessage}>장소</InputLabel>
            <Select {...field}>
              {/*{programData.categories.map((oneDepthItem) => (*/}
              {/*  <Option*/}
              {/*    key={oneDepthItem['sessionCategoryIdx']}*/}
              {/*    value={oneDepthItem['sessionCategoryIdx']}*/}
              {/*  >*/}
              {/*    {oneDepthItem['sessionCategoryDate']} :{' '}*/}
              {/*    {oneDepthItem['sessionCategoryTitle']}*/}
              {/*  </Option>*/}
              {/*))}*/}
            </Select>
            {index !== null && errors[filedName]?.index?.locationIdx && (
              <FormHelperText error>
                {errors[filedName]?.index?.locationIdx.message}
              </FormHelperText>
            )}
            {index === null ||
              (errors.locationIdx && (
                <FormHelperText error>
                  {errors.locationIdx.message}
                </FormHelperText>
              ))}
          </FormControl>
        )}
      />
    </Grid>
  );
}
