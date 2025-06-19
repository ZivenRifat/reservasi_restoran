// src/components/SectionTitle.tsx

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold">
      {title}
    </h2>
  )
}

export default SectionTitle;
