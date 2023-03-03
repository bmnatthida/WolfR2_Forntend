import { INavigationMenu } from "../IRequestModel/INavagationModel";

export const GetNavbarMenu = async (
  email: string
): Promise<INavigationMenu[]> => {
  const respone: INavigationMenu[] = await fetch(
    "api/NavbarMenu/GetAllByEmail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mail: email }),
    }
  )
    .then((response) => response.json())
    .then((navBarData: INavigationMenu[]) => {
      if (navBarData) {
        console.log({ navBarData });

        const formatNav = navBarData.map((menu) => {
          return {
            ...menu,
            GroupMenu:
              menu.GroupMenu.charAt(0).toUpperCase() + menu.GroupMenu.slice(1),
          };
        });
        return formatNav;
      }
      return [];
    });

  return respone;
};
