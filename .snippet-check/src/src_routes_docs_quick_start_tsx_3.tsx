import { Button } from "@novix-ui/react";
import { ArrowRight } from "lucide-react";

export default function Hello() {
  return <Button trailingIcon={<ArrowRight />}>Ship it</Button>;
}