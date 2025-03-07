{
  pkgs ? import <nixpkgs> { },
}:

with pkgs;
mkShell {
  name = "browser-bitahub";
  buildInputs = [
    web-ext
  ];
}
