import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [formError, setFormError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.post(
        "https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=get_all_main_cat",
        {
          deviceType: "web",
          username: "anvar",
        }
      );
      setCategories(response.data.message || []);
    } catch (error) {
      setError("Failed to fetch categories.");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (event) => {
    event.preventDefault();
    if (!newCategoryName.trim()) {
      setFormError("Category name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        "https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=insert_main_catagory",
        {
          deviceType: "web",
          username: "anvar",
          cat_name: newCategoryName,
        }
      );

      if (response.data.success) {
        // Add new category directly to the state
        const newCategory = {
          MAIN_CAT_ID: response.data.newCategoryId, // Assuming API returns new category ID
          MAIN_CAT_NAME: newCategoryName,
          CREATED_USER: "anvar", // Example data
          CREATED_TIME: new Date().toISOString(),
          LAST_UPD_USER: "anvar",
          LAST_UPD_TIME: new Date().toISOString(),
        };
        setCategories([newCategory, ...categories]);
        setNewCategoryName("");
        setFormError("");
      } else {
        setFormError("Failed to add category.");
      }
    } catch (error) {
      setFormError("Failed to add category.");
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateCategory = async (event) => {
    event.preventDefault();
    if (!updatedCategoryName.trim() || !selectedCategory) {
      setFormError("Category name cannot be empty and no category selected.");
      return;
    }

    try {
      const response = await axios.post(
        "https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=update_main_catagory",
        {
          deviceType: "web",
          username: "anvar",
          cat_name: updatedCategoryName,
          main_cat_id: selectedCategory.MAIN_CAT_ID,
          deleted_flg: "U",
        }
      );

      if (response.data.success) {
        setCategories(
          categories.map((cat) =>
            cat.MAIN_CAT_ID === selectedCategory.MAIN_CAT_ID
              ? { ...cat, MAIN_CAT_NAME: updatedCategoryName }
              : cat
          )
        );
        setUpdatedCategoryName("");
        setSelectedCategory(null);
        setFormError("");
      } else {
        setFormError("Failed to update category.");
      }
    } catch (error) {
      setFormError("Failed to update category.");
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${category.MAIN_CAT_NAME}"?`
      )
    ) {
      try {
        const response = await axios.post(
          "https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=update_main_catagory",
          {
            deviceType: "web",
            username: "anvar",
            cat_name: category.MAIN_CAT_NAME,
            main_cat_id: category.MAIN_CAT_ID,
            deleted_flg: "D",
          }
        );

        if (response.data.success) {
          setCategories(
            categories.filter((cat) => cat.MAIN_CAT_ID !== category.MAIN_CAT_ID)
          );
        } else {
          setFormError("Failed to delete category.");
        }
      } catch (error) {
        setFormError("Failed to delete category.");
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setUpdatedCategoryName(category.MAIN_CAT_NAME);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Row>
        <Col md={12} className="mb-4">
          <Form onSubmit={handleAddCategory}>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              {formError && (
                <Form.Text className="text-danger">{formError}</Form.Text>
              )}
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Category
            </Button>
          </Form>
        </Col>

        {selectedCategory && (
          <Col md={12} className="mb-4">
            <Form onSubmit={handleUpdateCategory}>
              <Form.Group controlId="formUpdateCategoryName">
                <Form.Label>Update Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Update category name"
                  value={updatedCategoryName}
                  onChange={(e) => setUpdatedCategoryName(e.target.value)}
                />
                {formError && (
                  <Form.Text className="text-danger">{formError}</Form.Text>
                )}
              </Form.Group>
              <Button variant="primary" type="submit">
                Update Category
              </Button>
            </Form>
          </Col>
        )}

        {categories.length > 0 ? (
          categories.map((category) => (
            <Col md={4} key={category.MAIN_CAT_ID} className="mb-4">
              <Card className="new">
                <Card.Body>
                  <Card.Title>{category.MAIN_CAT_NAME}</Card.Title>
                  <Card.Text>
                    Created by: {category.CREATED_USER} <br />
                    Created on:{" "}
                    {new Date(category.CREATED_TIME).toLocaleDateString()}{" "}
                    <br />
                    Last updated:{" "}
                    {new Date(category.LAST_UPD_TIME).toLocaleDateString()}
                  </Card.Text>
                  <Button
                    variant="warning"
                    onClick={() => handleSelectCategory(category)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <div>No categories found.</div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Categories;