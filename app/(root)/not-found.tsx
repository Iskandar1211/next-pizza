import { InfoBlock } from '@/components/shared/info-block';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <InfoBlock
        title="Страница не найдена"
        text="Проверьте корректность введённого адреса или повторите попытку позже"
        imageUrl="/assets/images/not-found.png"
      />
    </div>
  );
}
