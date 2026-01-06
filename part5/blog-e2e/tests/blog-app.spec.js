const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog App", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await request.post("/api/users", {
      data: {
        name: "Test User",
        username: "testuser",
        password: "testpassword",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = page.getByRole("button", { name: "login" });

    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");

      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with the wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("invalid username or password");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

      await expect(
        page.getByText("Matti Luukkainen logged in")
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "Creating a blog with Playwright",
        "Test Author",
        "http://testurl.com"
      );

      const successDiv = page.locator(".success");
      await expect(successDiv).toContainText(
        'a new blog "Creating a blog with Playwright" by Test Author added'
      );
      await expect(successDiv).toHaveCSS("border-style", "solid");
      await expect(successDiv).toHaveCSS("color", "rgb(0, 128, 0)");

      await expect(
        page.getByText("Creating a blog with Playwright Test Author")
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(
        page,
        "Creating a blog with Playwright",
        "Test Author",
        "http://testurl.com"
      );

      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "like" }).click();

      await expect(page.locator(".likes-count").getByText("1")).toBeVisible();
    });

    test("a blog can be deleted by its creator", async ({ page }) => {
      await createBlog(
        page,
        "Creating a blog with Playwright",
        "Test Author",
        "http://testurl.com"
      );

      page.on("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm");
        expect(dialog.message()).toBe(
          'Are you sure you want to delete "Creating a blog with Playwright" by Test Author?'
        );

        await dialog.accept();
      });

      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "remove" }).click();

      const successDiv = page.locator(".success");
      await expect(successDiv).toContainText("blog was deleted");
      await expect(successDiv).toHaveCSS("border-style", "solid");
      await expect(successDiv).toHaveCSS("color", "rgb(0, 128, 0)");

      await expect(
        page.getByText("Creating a blog with Playwright Test Author")
      ).not.toBeVisible();
    });

    test("only blogs created by the logged user display the remove button", async ({
      page,
    }) => {
      await createBlog(page, "Blog 1", "Test Author 1", "http://testurl.com");
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();
      await loginWith(page, "testuser", "testpassword");
      await expect(page.getByText("Test User logged in")).toBeVisible();

      await page.getByRole("button", { name: "view" }).click();
      await expect(
        page.getByRole("button", { name: "remove" })
      ).not.toBeVisible();
    });

    test("blogs are ordered by likes (descending)", async ({ page }) => {
      await createBlog(
        page,
        "Blog with least likes",
        "Author 1",
        "http://testurl.com"
      );
      await createBlog(
        page,
        "Blog with most likes",
        "Author 2",
        "http://testurl.com"
      );
      await createBlog(
        page,
        "Blog with medium likes",
        "Author 3",
        "http://testurl.com"
      );

      await page
        .locator(".blog")
        .filter({ hasText: "Blog with least likes" })
        .getByRole("button", { name: "view" })
        .click();
      await page
        .locator(".blog")
        .filter({ hasText: "Blog with least likes" })
        .getByRole("button", { name: "like" })
        .click();
      await page
        .locator(".blog")
        .filter({ hasText: "Blog with least likes" })
        .getByText("likes 1")
        .waitFor();

      await page
        .locator(".blog")
        .filter({ hasText: "Blog with most likes" })
        .getByRole("button", { name: "view" })
        .click();
      const secondBlogElement = page
        .locator(".blog")
        .filter({ hasText: "Blog with most likes" });

      for (let i = 0; i < 5; i++) {
        await secondBlogElement.getByRole("button", { name: "like" }).click();
        await secondBlogElement.getByText(`likes ${i + 1}`).waitFor();
      }

      await page
        .locator(".blog")
        .filter({ hasText: "Blog with medium likes" })
        .getByRole("button", { name: "view" })
        .click();
      const thirdBlogElement = page
        .locator(".blog")
        .filter({ hasText: "Blog with medium likes" });

      for (let i = 0; i < 3; i++) {
        await thirdBlogElement.getByRole("button", { name: "like" }).click();
        await thirdBlogElement.getByText(`likes ${i + 1}`).waitFor();
      }
      const blogs = await page.locator(".blog").all();

      expect(blogs.length).toBe(3);

      await expect(blogs[0]).toContainText("Blog with most likes");
      await expect(blogs[1]).toContainText("Blog with medium likes");
      await expect(blogs[2]).toContainText("Blog with least likes");
    });
  });
});
