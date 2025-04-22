import React, { useState, useRef, useCallback, useEffect } from "react";
import { PageContainer } from "../../components/PageContainer";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useHeader } from "../../hooks/useHeader";
import { Variant } from "../../stores/ProductProvider/types";
import { VariantFilters } from "../../components/VariantFilters/VariantFilters";
import { VariantList } from "../../components/VariantList/VariantList";
import {
  getUniqueSubTypes,
  filterVariantsBySubType,
  sortVariantsByPrice,
  findVariantIndex,
  formatPrice,
} from "../../utils/variantUtils";
import { getClosestVariantIndex } from "../../utils/getClosestVariant";
import { useSearchParams } from "react-router-dom";

export const TopupPage: React.FC = () => {
  const { brand } = useProduct();
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSubType, setSelectedSubType] = useState<string>("");
  const sliderRef = useRef<Slider>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  useHeader(brand.brandName);

  const uniqueSubTypes = getUniqueSubTypes(brand.variants);
  const filteredVariants = filterVariantsBySubType(
    brand.variants,
    selectedSubType
  );
  const orderedVariants = sortVariantsByPrice(filteredVariants);

  useEffect(() => {
    if (type) {
      setSelectedSubType(type);
    }
  }, [type]);

  const updateSelectedVariant = useCallback(
    (value: string) => {
      if (value && !isNaN(Number(value))) {
        const targetValue = parseFloat(value);
        const closestIndex = getClosestVariantIndex(
          orderedVariants,
          targetValue
        );
        setSelectedIndex(closestIndex);
        sliderRef.current?.slickGoTo(closestIndex);
      }
    },
    [orderedVariants]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      updateSelectedVariant(value);
    }, 300);
  };

  const handleVariantClick = (variant: Variant, index: number) => {
    const value = formatPrice(variant.price.fiatValue);
    setInputValue(value);

    const variantIndex = findVariantIndex(orderedVariants, variant.id);
    setSelectedIndex(variantIndex);
    sliderRef.current?.slickGoTo(variantIndex);
  };

  const handleSubTypeClick = (subType: string) => {
    setSelectedSubType(subType);
    setSelectedIndex(0);
    setInputValue("");
  };

  return (
    <PageContainer>
      <ImageAvatar
        src={brand.imageUrl}
        name={brand.brandName}
        sx={{ width: 100, height: 100 }}
        hideName
      />

      <VariantFilters
        uniqueSubTypes={uniqueSubTypes}
        selectedSubType={selectedSubType}
        inputValue={inputValue}
        onSubTypeClick={handleSubTypeClick}
        onInputChange={handleInputChange}
      />

      <VariantList
        variants={orderedVariants}
        selectedIndex={selectedIndex}
        brandName={brand.brandName}
        onVariantClick={handleVariantClick}
        sliderRef={sliderRef}
      />
    </PageContainer>
  );
};
